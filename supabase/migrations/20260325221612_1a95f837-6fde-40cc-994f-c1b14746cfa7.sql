
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS audio_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('proposal-audio', 'proposal-audio', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_read_proposal_audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'proposal-audio');

CREATE POLICY "auth_insert_proposal_audio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'proposal-audio');

CREATE POLICY "auth_update_proposal_audio"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'proposal-audio');

CREATE POLICY "auth_delete_proposal_audio"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'proposal-audio');
