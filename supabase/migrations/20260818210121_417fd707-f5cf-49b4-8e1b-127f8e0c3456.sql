ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS theme jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS template text NOT NULL DEFAULT 'classic',
  ADD COLUMN IF NOT EXISTS section_order jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.playlist_songs
  ADD COLUMN IF NOT EXISTS cover_url text,
  ADD COLUMN IF NOT EXISTS spotify_url text,
  ADD COLUMN IF NOT EXISTS youtube_url text,
  ADD COLUMN IF NOT EXISTS energy integer NOT NULL DEFAULT 3;

CREATE TABLE IF NOT EXISTS public.song_order_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_token_id uuid NOT NULL REFERENCES public.client_tokens(id) ON DELETE CASCADE,
  song_id uuid NOT NULL REFERENCES public.playlist_songs(id) ON DELETE CASCADE,
  display_order integer NOT NULL,
  UNIQUE (client_token_id, song_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.song_order_preferences TO authenticated;
GRANT ALL ON public.song_order_preferences TO service_role;

ALTER TABLE public.song_order_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS auth_all_song_order ON public.song_order_preferences;
CREATE POLICY auth_all_song_order ON public.song_order_preferences
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_song_orders(p_token text, p_orders jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE v_token_id uuid; v_proposal_id uuid; rec jsonb;
BEGIN
  SELECT id, proposal_id INTO v_token_id, v_proposal_id FROM public.client_tokens WHERE token = p_token;
  IF v_token_id IS NULL THEN RETURN false; END IF;
  FOR rec IN SELECT * FROM jsonb_array_elements(COALESCE(p_orders,'[]'::jsonb)) LOOP
    IF EXISTS (SELECT 1 FROM public.playlist_songs s WHERE s.id = (rec->>'song_id')::uuid AND s.proposal_id = v_proposal_id) THEN
      INSERT INTO public.song_order_preferences (client_token_id, song_id, display_order)
      VALUES (v_token_id, (rec->>'song_id')::uuid, (rec->>'display_order')::int)
      ON CONFLICT (client_token_id, song_id) DO UPDATE SET display_order = EXCLUDED.display_order;
    END IF;
  END LOOP;
  RETURN true;
END; $function$;

CREATE OR REPLACE FUNCTION public.get_playlist_session(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    'block_orders', COALESCE((SELECT jsonb_agg(jsonb_build_object('block_id', bo.block_id, 'display_order', bo.display_order)) FROM public.block_order_preferences bo WHERE bo.client_token_id = t.id), '[]'::jsonb),
    'song_orders', COALESCE((SELECT jsonb_agg(jsonb_build_object('song_id', so.song_id, 'display_order', so.display_order)) FROM public.song_order_preferences so WHERE so.client_token_id = t.id), '[]'::jsonb)
  );
END; $function$;