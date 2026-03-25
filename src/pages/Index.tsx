import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProposalProvider } from "@/contexts/ProposalContext";
import type { ProposalData } from "@/contexts/ProposalContext";
import { proposalTemplate } from "@/data/proposalTemplate";
import HeroSection from "@/components/HeroSection";
import TimelineSection from "@/components/TimelineSection";
import SongsSection from "@/components/SongsSection";
import GallerySection from "@/components/GallerySection";
import ProcessTimeline from "@/components/ProcessTimeline";
import PricingSection from "@/components/PricingSection";
import LedPanelSection from "@/components/LedPanelSection";
import FooterSection from "@/components/FooterSection";
import EntranceGate from "@/components/EntranceGate";
import BackgroundMusic from "@/components/BackgroundMusic";
import logo from "@/assets/logo-homemusic.png";

gsap.registerPlugin(ScrollTrigger);

const defaultProposal: ProposalData = {
  id: "default",
  slug: "esther-gabriel-2027",
  status: "active",
  bride_name: "Esther",
  groom_name: "Gabriel",
  event_date: "2027-03-13",
  event_start_time: proposalTemplate.event_start_time,
  event_end_time: proposalTemplate.event_end_time,
  venue_name: "Ninho da Roxinha",
  guest_count: proposalTemplate.guest_count,
  duration_label: proposalTemplate.duration_label,
  proposal_deadline: "2026-04-01T13:00:00Z",
  whatsapp_number: proposalTemplate.whatsapp_number,
  partnership_name: "Carol Suhet",
  partnership_instagram: "https://www.instagram.com/carolsuhetcerimonialista/",
  partnership_photo_url: null,
  pricing_plans: proposalTemplate.pricing_plans,
  included_services: proposalTemplate.included_services,
  tech_details: proposalTemplate.tech_details,
  event_timeline: proposalTemplate.event_timeline,
  process_steps: proposalTemplate.process_steps,
  showcase_songs: proposalTemplate.showcase_songs,
  optional_extras: proposalTemplate.optional_extras,
  extras_bundle_title: proposalTemplate.extras_bundle_title,
  extras_bundle_price: proposalTemplate.extras_bundle_price,
  audio_url: "/audio/background-music.mp3",
};

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!entered) return;

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      const bg = section.querySelector("img");
      if (bg) {
        gsap.to(bg, {
          y: "20%", ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      }
    });

    gsap.utils.toArray(".glass-surface").forEach((el: any) => {
      gsap.fromTo(el,
        { borderColor: "hsla(43, 20%, 20%, 0)" },
        { borderColor: "hsla(43, 20%, 20%, 0.2)", duration: 1, scrollTrigger: { trigger: el, start: "top 85%" } }
      );
    });

    gsap.utils.toArray("section").forEach((el: any, i: number) => {
      if (i === 0) return;
      gsap.fromTo(el, { opacity: 0.3 }, {
        opacity: 1, duration: 0.8,
        scrollTrigger: { trigger: el, start: "top 90%", end: "top 50%", scrub: true },
      });
    });

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, [entered]);

  if (!entered) {
    return <EntranceGate onEnter={() => setEntered(true)} brideName="Esther" groomName="Gabriel" />;
  }

  return (
    <ProposalProvider value={defaultProposal}>
      <BackgroundMusic startPlaying audioUrl="/audio/background-music.mp3" />
      <div ref={containerRef} className="grain-overlay">
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between glass-surface px-6 py-3 rounded-sm">
            <img src={logo} alt="Home Music" className="h-8 md:h-10 w-auto" />
            <div className="flex items-center gap-3">
              <a href="/playlist/esther-gabriel-2027" className="font-ui text-[10px] tracking-[0.2em] uppercase px-4 py-2 text-muted-foreground hover:text-primary transition-colors duration-150 hidden sm:block">Repertório</a>
              <a href="https://wa.me/5527999936682?text=Ol%C3%A1!%20Gostaria%20de%20aceitar%20a%20proposta%20musical%20para%20nosso%20casamento.%20Podemos%20conversar%3F" target="_blank" rel="noopener noreferrer" className="font-ui text-[10px] tracking-[0.2em] uppercase px-5 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 rounded-sm">Aceitar Proposta</a>
            </div>
          </div>
        </nav>

        <HeroSection />
        <div className="flex items-center justify-center py-1"><div className="w-px h-8 timeline-line" /></div>
        <TimelineSection />
        <SongsSection />
        <ProcessTimeline />
        <PricingSection />
        <LedPanelSection />
        <GallerySection />
        <FooterSection />
      </div>
    </ProposalProvider>
  );
};

export default Index;
