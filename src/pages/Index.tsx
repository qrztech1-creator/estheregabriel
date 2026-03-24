import HeroSection from "@/components/HeroSection";
import TimelineSection from "@/components/TimelineSection";
import SongsSection from "@/components/SongsSection";
import ProcessTimeline from "@/components/ProcessTimeline";
import CeremonySection from "@/components/CeremonySection";
import PricingSection from "@/components/PricingSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="grain-overlay">
      {/* Floating nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass-surface px-6 py-3 rounded-sm">
          <span className="font-display text-lg text-foreground">Home Music</span>
          <a
            href="https://wa.me/5527999936682"
            target="_blank"
            rel="noopener noreferrer"
            className="font-ui text-[10px] tracking-[0.2em] uppercase px-5 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-sm"
          >
            Aceitar Proposta
          </a>
        </div>
      </nav>

      <HeroSection />

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="w-px h-20 timeline-line" />
      </div>

      <TimelineSection />
      <SongsSection />
      <ProcessTimeline />
      <CeremonySection />
      <PricingSection />
      <FooterSection />
    </div>
  );
};

export default Index;
