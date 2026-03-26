
INSERT INTO storage.buckets (id, name, public) VALUES ('proposal-contracts', 'proposal-contracts', false) ON CONFLICT DO NOTHING;

CREATE POLICY "auth_all_contracts" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'proposal-contracts') WITH CHECK (bucket_id = 'proposal-contracts');

ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS contract_file_url text;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS payment_receipts jsonb DEFAULT '[]'::jsonb;
