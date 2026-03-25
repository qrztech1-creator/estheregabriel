
ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS client_email text,
  ADD COLUMN IF NOT EXISTS client_phone text,
  ADD COLUMN IF NOT EXISTS client_instagram text,
  ADD COLUMN IF NOT EXISTS contract_value numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS contract_status text DEFAULT 'proposal_sent',
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS last_viewed_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;
