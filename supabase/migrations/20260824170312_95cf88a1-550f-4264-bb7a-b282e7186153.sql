ALTER TABLE public.proposal_packages
  ADD COLUMN IF NOT EXISTS media jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS image_url text;

ALTER TABLE public.proposal_package_items
  ADD COLUMN IF NOT EXISTS media jsonb NOT NULL DEFAULT '[]'::jsonb;

DROP POLICY IF EXISTS "proposal_media_auth_read" ON storage.objects;
CREATE POLICY "proposal_media_auth_read" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'proposal-media');

DROP POLICY IF EXISTS "proposal_media_auth_write" ON storage.objects;
CREATE POLICY "proposal_media_auth_write" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'proposal-media');

DROP POLICY IF EXISTS "proposal_media_auth_update" ON storage.objects;
CREATE POLICY "proposal_media_auth_update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'proposal-media');

DROP POLICY IF EXISTS "proposal_media_auth_delete" ON storage.objects;
CREATE POLICY "proposal_media_auth_delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'proposal-media');

CREATE OR REPLACE FUNCTION public.get_public_proposal(p_slug text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
        'image_url', pk.image_url, 'media', COALESCE(pk.media, '[]'::jsonb),
        'items', COALESCE((
          SELECT jsonb_agg(jsonb_build_object(
            'id', it.id, 'name', it.name, 'description', it.description, 'category', it.category,
            'quantity', it.quantity, 'unit_price', it.unit_price,
            'is_courtesy', it.is_courtesy, 'is_optional', it.is_optional,
            'media', COALESCE(it.media, '[]'::jsonb)
          ) ORDER BY it.display_order)
          FROM public.proposal_package_items it WHERE it.package_id = pk.id), '[]'::jsonb)
      ) ORDER BY pk.display_order)
      FROM public.proposal_packages pk WHERE pk.proposal_id = p.id), '[]'::jsonb),
    'extra_items', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', it.id, 'name', it.name, 'description', it.description, 'category', it.category,
        'quantity', it.quantity, 'unit_price', it.unit_price,
        'is_courtesy', it.is_courtesy, 'is_optional', it.is_optional,
        'media', COALESCE(it.media, '[]'::jsonb)
      ) ORDER BY it.display_order)
      FROM public.proposal_package_items it
      WHERE it.proposal_id = p.id AND it.package_id IS NULL), '[]'::jsonb)
  );
  RETURN result;
END; $function$;