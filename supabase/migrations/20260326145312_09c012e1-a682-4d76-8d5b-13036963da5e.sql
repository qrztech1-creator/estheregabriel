
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS created_by text DEFAULT NULL;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS accepted_at timestamp with time zone DEFAULT NULL;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS accepted_plan jsonb DEFAULT NULL;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS accepted_payment_method text DEFAULT NULL;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS accepted_notes text DEFAULT NULL;
