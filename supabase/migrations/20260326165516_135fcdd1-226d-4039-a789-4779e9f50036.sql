
CREATE TABLE public.proposal_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL,
  actor_type text NOT NULL DEFAULT 'admin',
  actor_name text,
  action text NOT NULL,
  changes jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.proposal_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_all_audit_log" ON public.proposal_audit_log FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_insert_audit_log" ON public.proposal_audit_log FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_audit_log" ON public.proposal_audit_log FOR SELECT TO anon USING (true);

CREATE INDEX idx_audit_log_proposal ON public.proposal_audit_log (proposal_id);

ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS accepted_extras jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS accepted_payment_types text[] DEFAULT '{}';
