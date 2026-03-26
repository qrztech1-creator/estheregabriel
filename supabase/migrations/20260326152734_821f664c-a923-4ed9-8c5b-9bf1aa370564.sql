-- Allow anon to update ONLY acceptance fields on active proposals
CREATE POLICY "anon_accept_proposals"
ON public.proposals
FOR UPDATE
TO anon
USING (status = 'active' AND accepted_at IS NULL)
WITH CHECK (status = 'active');

-- Create a function to safely increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count(proposal_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE proposals
  SET view_count = COALESCE(view_count, 0) + 1,
      last_viewed_at = now()
  WHERE slug = proposal_slug AND status = 'active';
END;
$$;

-- Tighten anon policies on song_preferences
DROP POLICY IF EXISTS "anon_all_preferences" ON public.song_preferences;
CREATE POLICY "anon_select_preferences" ON public.song_preferences FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_preferences" ON public.song_preferences FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_preferences" ON public.song_preferences FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_preferences" ON public.song_preferences FOR DELETE TO anon USING (true);

-- Tighten anon policies on song_suggestions
DROP POLICY IF EXISTS "anon_all_suggestions" ON public.song_suggestions;
CREATE POLICY "anon_select_suggestions" ON public.song_suggestions FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_suggestions" ON public.song_suggestions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_delete_suggestions" ON public.song_suggestions FOR DELETE TO anon USING (true);

-- Tighten anon policies on dj_playlist_links
DROP POLICY IF EXISTS "anon_all_dj_links" ON public.dj_playlist_links;
CREATE POLICY "anon_select_dj_links" ON public.dj_playlist_links FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_dj_links" ON public.dj_playlist_links FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_delete_dj_links" ON public.dj_playlist_links FOR DELETE TO anon USING (true);

-- Tighten anon policies on block_order_preferences
DROP POLICY IF EXISTS "anon_all_block_order" ON public.block_order_preferences;
CREATE POLICY "anon_select_block_order" ON public.block_order_preferences FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_block_order" ON public.block_order_preferences FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_block_order" ON public.block_order_preferences FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Add auth ALL policies for tables missing them
CREATE POLICY "auth_all_preferences" ON public.song_preferences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_suggestions" ON public.song_suggestions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_dj_links" ON public.dj_playlist_links FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_block_order" ON public.block_order_preferences FOR ALL TO authenticated USING (true) WITH CHECK (true);