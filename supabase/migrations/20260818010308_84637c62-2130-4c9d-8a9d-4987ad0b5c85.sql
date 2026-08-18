-- ============ 1. SCHEMA ============
ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS region text NOT NULL DEFAULT 'gv',
  ADD COLUMN IF NOT EXISTS event_type text,
  ADD COLUMN IF NOT EXISTS selected_packages jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS public.proposal_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'festa',
  sale_price numeric NOT NULL DEFAULT 0,
  internal_cost numeric NOT NULL DEFAULT 0,
  is_optional boolean NOT NULL DEFAULT false,
  is_courtesy boolean NOT NULL DEFAULT false,
  recommended boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proposal_packages TO authenticated;
GRANT ALL ON public.proposal_packages TO service_role;
ALTER TABLE public.proposal_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY auth_all_packages ON public.proposal_packages FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.proposal_package_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  package_id uuid REFERENCES public.proposal_packages(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'servico',
  quantity integer NOT NULL DEFAULT 1,
  unit_cost numeric NOT NULL DEFAULT 0,
  unit_price numeric NOT NULL DEFAULT 0,
  is_courtesy boolean NOT NULL DEFAULT false,
  is_optional boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proposal_package_items TO authenticated;
GRANT ALL ON public.proposal_package_items TO service_role;
ALTER TABLE public.proposal_package_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY auth_all_package_items ON public.proposal_package_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.proposal_checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'tecnico',
  item text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proposal_checklist TO authenticated;
GRANT ALL ON public.proposal_checklist TO service_role;
ALTER TABLE public.proposal_checklist ENABLE ROW LEVEL SECURITY;
CREATE POLICY auth_all_checklist ON public.proposal_checklist FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.proposal_internal_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL UNIQUE REFERENCES public.proposals(id) ON DELETE CASCADE,
  closed_by text,
  executed_by text,
  technical_lead text,
  revenue_split jsonb NOT NULL DEFAULT '[]'::jsonb,
  terms text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proposal_internal_contracts TO authenticated;
GRANT ALL ON public.proposal_internal_contracts TO service_role;
ALTER TABLE public.proposal_internal_contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY auth_all_internal_contracts ON public.proposal_internal_contracts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE UNIQUE INDEX IF NOT EXISTS song_preferences_token_song_key ON public.song_preferences (client_token_id, song_id);
CREATE UNIQUE INDEX IF NOT EXISTS block_order_token_block_key ON public.block_order_preferences (client_token_id, block_id);

-- ============ 2. DROP PERMISSIVE ANON POLICIES ============
DROP POLICY IF EXISTS anon_insert_block_order ON public.block_order_preferences;
DROP POLICY IF EXISTS anon_select_block_order ON public.block_order_preferences;
DROP POLICY IF EXISTS anon_update_block_order ON public.block_order_preferences;
DROP POLICY IF EXISTS anon_read_tokens ON public.client_tokens;
DROP POLICY IF EXISTS anon_delete_dj_links ON public.dj_playlist_links;
DROP POLICY IF EXISTS anon_insert_dj_links ON public.dj_playlist_links;
DROP POLICY IF EXISTS anon_select_dj_links ON public.dj_playlist_links;
DROP POLICY IF EXISTS anon_read_blocks ON public.playlist_blocks;
DROP POLICY IF EXISTS anon_read_songs ON public.playlist_songs;
DROP POLICY IF EXISTS anon_insert_audit_log ON public.proposal_audit_log;
DROP POLICY IF EXISTS anon_select_audit_log ON public.proposal_audit_log;
DROP POLICY IF EXISTS anon_accept_proposals ON public.proposals;
DROP POLICY IF EXISTS anon_read_active_proposals ON public.proposals;
DROP POLICY IF EXISTS anon_delete_preferences ON public.song_preferences;
DROP POLICY IF EXISTS anon_insert_preferences ON public.song_preferences;
DROP POLICY IF EXISTS anon_select_preferences ON public.song_preferences;
DROP POLICY IF EXISTS anon_update_preferences ON public.song_preferences;
DROP POLICY IF EXISTS anon_delete_suggestions ON public.song_suggestions;
DROP POLICY IF EXISTS anon_insert_suggestions ON public.song_suggestions;
DROP POLICY IF EXISTS anon_select_suggestions ON public.song_suggestions;

REVOKE ALL ON public.proposals FROM anon;
REVOKE ALL ON public.client_tokens FROM anon;
REVOKE ALL ON public.playlist_blocks FROM anon;
REVOKE ALL ON public.playlist_songs FROM anon;
REVOKE ALL ON public.song_preferences FROM anon;
REVOKE ALL ON public.song_suggestions FROM anon;
REVOKE ALL ON public.dj_playlist_links FROM anon;
REVOKE ALL ON public.block_order_preferences FROM anon;
REVOKE ALL ON public.proposal_audit_log FROM anon;

REVOKE EXECUTE ON FUNCTION public.increment_view_count(text) FROM anon, authenticated, public;

-- ============ 3. PUBLIC RPCs ============
CREATE OR REPLACE FUNCTION public.get_public_proposal(p_slug text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE p public.proposals%ROWTYPE; result jsonb;
BEGIN
  SELECT * INTO p FROM public.proposals WHERE slug = p_slug AND status = 'active';
  IF NOT FOUND THEN RETURN NULL; END IF;
  UPDATE public.proposals SET view_count = COALESCE(view_count,0)+1, last_viewed_at = now() WHERE id = p.id;
  result := to_jsonb(p) - 'client_email' - 'client_phone' - 'client_instagram'
    - 'contract_value' - 'contract_status' - 'notes' - 'contract_file_url'
    - 'payment_receipts' - 'view_count' - 'last_viewed_at';
  result := result || jsonb_build_object(
    'packages', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', pk.id, 'name', pk.name, 'description', pk.description, 'category', pk.category,
        'sale_price', pk.sale_price, 'is_optional', pk.is_optional, 'is_courtesy', pk.is_courtesy,
        'recommended', pk.recommended, 'display_order', pk.display_order,
        'items', COALESCE((
          SELECT jsonb_agg(jsonb_build_object(
            'id', it.id, 'name', it.name, 'description', it.description, 'category', it.category,
            'quantity', it.quantity, 'unit_price', it.unit_price,
            'is_courtesy', it.is_courtesy, 'is_optional', it.is_optional
          ) ORDER BY it.display_order)
          FROM public.proposal_package_items it WHERE it.package_id = pk.id), '[]'::jsonb)
      ) ORDER BY pk.display_order)
      FROM public.proposal_packages pk WHERE pk.proposal_id = p.id), '[]'::jsonb),
    'extra_items', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', it.id, 'name', it.name, 'description', it.description, 'category', it.category,
        'quantity', it.quantity, 'unit_price', it.unit_price,
        'is_courtesy', it.is_courtesy, 'is_optional', it.is_optional
      ) ORDER BY it.display_order)
      FROM public.proposal_package_items it
      WHERE it.proposal_id = p.id AND it.package_id IS NULL), '[]'::jsonb)
  );
  RETURN result;
END; $$;
GRANT EXECUTE ON FUNCTION public.get_public_proposal(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.accept_proposal(
  p_slug text, p_plan jsonb, p_payment_method text, p_payment_types text[],
  p_extras jsonb, p_notes text, p_final_value numeric, p_selected_packages jsonb DEFAULT '[]'::jsonb)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE p public.proposals%ROWTYPE;
BEGIN
  SELECT * INTO p FROM public.proposals WHERE slug = p_slug AND status = 'active' AND accepted_at IS NULL;
  IF NOT FOUND THEN RETURN false; END IF;
  IF p_final_value IS NULL OR p_final_value < 0 OR p_final_value > 1000000 THEN RETURN false; END IF;
  UPDATE public.proposals SET
    accepted_at = now(), accepted_plan = p_plan,
    accepted_payment_method = left(COALESCE(p_payment_method,''), 120),
    accepted_notes = left(COALESCE(p_notes,''), 2000),
    accepted_extras = COALESCE(p_extras, '[]'::jsonb),
    accepted_payment_types = COALESCE(p_payment_types, '{}'),
    selected_packages = COALESCE(p_selected_packages, '[]'::jsonb),
    contract_status = 'accepted', contract_value = p_final_value
  WHERE id = p.id;
  INSERT INTO public.proposal_audit_log (proposal_id, actor_type, actor_name, action, changes)
  VALUES (p.id, 'client', p.bride_name || ' & ' || p.groom_name, 'accepted',
    jsonb_build_object('payment_method', p_payment_method, 'final_value', p_final_value,
                       'packages', p_selected_packages, 'extras', p_extras, 'notes', p_notes));
  RETURN true;
END; $$;
GRANT EXECUTE ON FUNCTION public.accept_proposal(text, jsonb, text, text[], jsonb, text, numeric, jsonb) TO anon, authenticated;

-- ============ 4. PLAYLIST RPCs (token scoped) ============
CREATE OR REPLACE FUNCTION public.get_playlist_session(p_token text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t public.client_tokens%ROWTYPE;
BEGIN
  SELECT * INTO t FROM public.client_tokens WHERE token = p_token;
  IF NOT FOUND THEN RETURN NULL; END IF;
  RETURN jsonb_build_object(
    'client_name', t.client_name,
    'blocks', COALESCE((SELECT jsonb_agg(to_jsonb(b) ORDER BY b.display_order) FROM public.playlist_blocks b WHERE b.proposal_id = t.proposal_id), '[]'::jsonb),
    'songs', COALESCE((SELECT jsonb_agg(to_jsonb(s) ORDER BY s.display_order) FROM public.playlist_songs s WHERE s.proposal_id = t.proposal_id), '[]'::jsonb),
    'preferences', COALESCE((SELECT jsonb_agg(jsonb_build_object('song_id', pr.song_id, 'status', pr.status)) FROM public.song_preferences pr WHERE pr.client_token_id = t.id), '[]'::jsonb),
    'suggestions', COALESCE((SELECT jsonb_agg(to_jsonb(sg) ORDER BY sg.created_at DESC) FROM public.song_suggestions sg WHERE sg.client_token_id = t.id), '[]'::jsonb),
    'dj_links', COALESCE((SELECT jsonb_agg(to_jsonb(dl) ORDER BY dl.created_at DESC) FROM public.dj_playlist_links dl WHERE dl.client_token_id = t.id), '[]'::jsonb),
    'block_orders', COALESCE((SELECT jsonb_agg(jsonb_build_object('block_id', bo.block_id, 'display_order', bo.display_order)) FROM public.block_order_preferences bo WHERE bo.client_token_id = t.id), '[]'::jsonb)
  );
END; $$;
GRANT EXECUTE ON FUNCTION public.get_playlist_session(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.set_song_preference(p_token text, p_song_id uuid, p_status text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_token_id uuid; v_proposal_id uuid;
BEGIN
  SELECT id, proposal_id INTO v_token_id, v_proposal_id FROM public.client_tokens WHERE token = p_token;
  IF v_token_id IS NULL THEN RETURN false; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.playlist_songs s WHERE s.id = p_song_id AND s.proposal_id = v_proposal_id) THEN RETURN false; END IF;
  IF p_status NOT IN ('approved','rejected','pending') THEN RETURN false; END IF;
  IF p_status = 'pending' THEN
    DELETE FROM public.song_preferences WHERE client_token_id = v_token_id AND song_id = p_song_id;
  ELSE
    INSERT INTO public.song_preferences (client_token_id, song_id, status, updated_at)
    VALUES (v_token_id, p_song_id, p_status, now())
    ON CONFLICT (client_token_id, song_id) DO UPDATE SET status = EXCLUDED.status, updated_at = now();
  END IF;
  RETURN true;
END; $$;
GRANT EXECUTE ON FUNCTION public.set_song_preference(text, uuid, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.set_block_orders(p_token text, p_orders jsonb)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_token_id uuid; v_proposal_id uuid; rec jsonb;
BEGIN
  SELECT id, proposal_id INTO v_token_id, v_proposal_id FROM public.client_tokens WHERE token = p_token;
  IF v_token_id IS NULL THEN RETURN false; END IF;
  FOR rec IN SELECT * FROM jsonb_array_elements(COALESCE(p_orders,'[]'::jsonb)) LOOP
    IF EXISTS (SELECT 1 FROM public.playlist_blocks b WHERE b.id = (rec->>'block_id')::uuid AND b.proposal_id = v_proposal_id) THEN
      INSERT INTO public.block_order_preferences (client_token_id, block_id, display_order)
      VALUES (v_token_id, (rec->>'block_id')::uuid, (rec->>'display_order')::int)
      ON CONFLICT (client_token_id, block_id) DO UPDATE SET display_order = EXCLUDED.display_order;
    END IF;
  END LOOP;
  RETURN true;
END; $$;
GRANT EXECUTE ON FUNCTION public.set_block_orders(text, jsonb) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.add_song_suggestion(p_token text, p_title text, p_artist text, p_notes text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_token_id uuid; v_row public.song_suggestions%ROWTYPE;
BEGIN
  SELECT id INTO v_token_id FROM public.client_tokens WHERE token = p_token;
  IF v_token_id IS NULL OR COALESCE(trim(p_title),'') = '' THEN RETURN NULL; END IF;
  INSERT INTO public.song_suggestions (client_token_id, title, artist, notes)
  VALUES (v_token_id, left(p_title,200), left(p_artist,200), left(p_notes,1000))
  RETURNING * INTO v_row;
  RETURN to_jsonb(v_row);
END; $$;
GRANT EXECUTE ON FUNCTION public.add_song_suggestion(text, text, text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.delete_song_suggestion(p_token text, p_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_token_id uuid;
BEGIN
  SELECT id INTO v_token_id FROM public.client_tokens WHERE token = p_token;
  IF v_token_id IS NULL THEN RETURN false; END IF;
  DELETE FROM public.song_suggestions WHERE id = p_id AND client_token_id = v_token_id;
  RETURN true;
END; $$;
GRANT EXECUTE ON FUNCTION public.delete_song_suggestion(text, uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.add_dj_playlist_link(p_token text, p_url text, p_name text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_token_id uuid; v_row public.dj_playlist_links%ROWTYPE;
BEGIN
  SELECT id INTO v_token_id FROM public.client_tokens WHERE token = p_token;
  IF v_token_id IS NULL OR COALESCE(trim(p_url),'') = '' THEN RETURN NULL; END IF;
  IF p_url !~* '^https?://' THEN RETURN NULL; END IF;
  INSERT INTO public.dj_playlist_links (client_token_id, spotify_url, name)
  VALUES (v_token_id, left(p_url,500), left(p_name,200))
  RETURNING * INTO v_row;
  RETURN to_jsonb(v_row);
END; $$;
GRANT EXECUTE ON FUNCTION public.add_dj_playlist_link(text, text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.delete_dj_playlist_link(p_token text, p_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_token_id uuid;
BEGIN
  SELECT id INTO v_token_id FROM public.client_tokens WHERE token = p_token;
  IF v_token_id IS NULL THEN RETURN false; END IF;
  DELETE FROM public.dj_playlist_links WHERE id = p_id AND client_token_id = v_token_id;
  RETURN true;
END; $$;
GRANT EXECUTE ON FUNCTION public.delete_dj_playlist_link(text, uuid) TO anon, authenticated;