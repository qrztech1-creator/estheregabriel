ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS show_partnership boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_optionals boolean NOT NULL DEFAULT true;