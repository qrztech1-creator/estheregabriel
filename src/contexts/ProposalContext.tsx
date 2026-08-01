import { createContext, useContext, ReactNode } from "react";

export interface ProposalData {
  id: string;
  slug: string;
  status: string;
  bride_name: string;
  groom_name: string;
  event_date: string;
  event_start_time: string;
  event_end_time: string;
  venue_name: string;
  guest_count: number;
  duration_label: string | null;
  proposal_deadline: string | null;
  whatsapp_number: string;
  partnership_name: string | null;
  partnership_instagram: string | null;
  partnership_photo_url: string | null;
  pricing_plans: any[];
  included_services: any[];
  tech_details: string[];
  event_timeline: any[];
  process_steps: any[];
  showcase_songs: any[];
  optional_extras: any[];
  extras_bundle_title: string | null;
  extras_bundle_price: number | null;
  show_partnership?: boolean | null;
  show_optionals?: boolean | null;
  audio_url: string | null;
  created_by: string | null;
  accepted_at: string | null;
  accepted_plan: any | null;
  accepted_payment_method: string | null;
  accepted_notes: string | null;
}

const ProposalContext = createContext<ProposalData | null>(null);

export const ProposalProvider = ({ children, value }: { children: ReactNode; value: ProposalData }) => (
  <ProposalContext.Provider value={value}>{children}</ProposalContext.Provider>
);

export const useProposal = () => useContext(ProposalContext);

export default ProposalContext;
