
CREATE TABLE public.proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'active',
  bride_name text NOT NULL,
  groom_name text NOT NULL,
  event_date date NOT NULL,
  event_start_time text NOT NULL DEFAULT '18:00',
  event_end_time text NOT NULL DEFAULT '22:00',
  venue_name text NOT NULL,
  guest_count integer NOT NULL DEFAULT 150,
  duration_label text DEFAULT '4 Horas de Música Imersiva',
  proposal_deadline timestamptz,
  whatsapp_number text NOT NULL DEFAULT '5527999936682',
  partnership_name text,
  partnership_instagram text,
  partnership_photo_url text,
  pricing_plans jsonb NOT NULL DEFAULT '[]'::jsonb,
  included_services jsonb NOT NULL DEFAULT '[]'::jsonb,
  tech_details jsonb NOT NULL DEFAULT '[]'::jsonb,
  event_timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  process_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  showcase_songs jsonb NOT NULL DEFAULT '[]'::jsonb,
  optional_extras jsonb NOT NULL DEFAULT '[]'::jsonb,
  extras_bundle_title text,
  extras_bundle_price numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_active_proposals" ON public.proposals
  FOR SELECT TO anon USING (status = 'active');

CREATE POLICY "auth_all_proposals" ON public.proposals
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.client_tokens 
  ADD COLUMN proposal_id uuid REFERENCES public.proposals(id) ON DELETE CASCADE;

ALTER TABLE public.playlist_blocks 
  ADD COLUMN proposal_id uuid REFERENCES public.proposals(id) ON DELETE CASCADE;

ALTER TABLE public.playlist_songs 
  ADD COLUMN proposal_id uuid REFERENCES public.proposals(id) ON DELETE CASCADE;

CREATE POLICY "auth_all_blocks" ON public.playlist_blocks
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_songs" ON public.playlist_songs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_client_tokens" ON public.client_tokens
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
