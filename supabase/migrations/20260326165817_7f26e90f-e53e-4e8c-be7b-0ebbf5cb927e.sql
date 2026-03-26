
DROP POLICY IF EXISTS "anon_accept_proposals" ON public.proposals;
CREATE POLICY "anon_accept_proposals" ON public.proposals
  FOR UPDATE TO anon
  USING (status = 'active' AND accepted_at IS NULL)
  WITH CHECK (status = 'active');
