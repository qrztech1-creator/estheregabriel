import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProposalProvider } from "@/contexts/ProposalContext";
import type { ProposalData } from "@/contexts/ProposalContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import { Music } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ProposalPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [entered, setEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) { navigate("/"); return; }
    supabase.from("proposals")
      .select("*")
      .eq("slug", slug)
      .eq("status", "active")
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) { navigate("/"); return; }
        setProposal(data as unknown as ProposalData);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!proposal || !entered) return;
    const timeout = setTimeout(() => {
      gsap.utils.toArray("section").forEach((el: any, i: number) => {
        if (i === 0) return;
        gsap.fromTo(el, { opacity: 0.3 }, {
          opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: el, start: "top 90%", end: "top 50%", scrub: true },
        });
      });
    }, 100);
    return () => { clearTimeout(timeout); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, [proposal, entered]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Music className="w-8 h-8 text-primary animate-pulse" />
    </div>
  );

  if (!proposal) return null;

  if (!entered) {
    return (
      <EntranceGate
        onEnter={() => setEntered(true)}
        brideName={proposal.bride_name}
        groomName={proposal.groom_name}
      />
    );
  }

  const whatsappMsg = encodeURIComponent(`Olá! Gostaria de aceitar a proposta musical para nosso casamento. Podemos conversar?`);

  return (
    <ProposalProvider value={proposal}>
      <BackgroundMusic startPlaying audioUrl={proposal.audio_url || "/audio/background-music.mp3"} />
      <div ref={containerRef} className="grain-overlay">
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between glass-surface px-6 py-3 rounded-sm">
            <img src={logo} alt="Home Music" className="h-8 md:h-10 w-auto" />
            <div className="flex items-center gap-3">
              <a href={`/playlist/${proposal.slug}`} className="font-ui text-[10px] tracking-[0.2em] uppercase px-4 py-2 text-muted-foreground hover:text-primary transition-colors duration-150 hidden sm:block">Repertório</a>
              <a href={`https://wa.me/${proposal.whatsapp_number}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="font-ui text-[10px] tracking-[0.2em] uppercase px-5 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 rounded-sm">Aceitar Proposta</a>
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

export default ProposalPage;
