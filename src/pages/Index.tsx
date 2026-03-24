import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "@/components/HeroSection";
import TimelineSection from "@/components/TimelineSection";
import SongsSection from "@/components/SongsSection";
import ProcessTimeline from "@/components/ProcessTimeline";
import CeremonySection from "@/components/CeremonySection";
import PricingSection from "@/components/PricingSection";
import FooterSection from "@/components/FooterSection";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax on section images
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      const bg = section.querySelector("img");
      if (bg) {
        gsap.to(bg, {
          y: "20%",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    });

    // Animate glass surfaces border on scroll
    gsap.utils.toArray(".glass-surface").forEach((el: any) => {
      gsap.fromTo(
        el,
        { borderColor: "hsla(43, 20%, 20%, 0)" },
        {
          borderColor: "hsla(43, 20%, 20%, 0.2)",
          duration: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    });

    // Smooth section reveals
    gsap.utils.toArray("section").forEach((el: any, i: number) => {
      if (i === 0) return; // skip hero
      gsap.fromTo(el,
        { opacity: 0.3 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: "top 50%",
            scrub: true,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="grain-overlay">
      {/* Floating nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass-surface px-6 py-3 rounded-sm">
          <span className="font-display text-lg text-foreground">Home Music</span>
          <div className="flex items-center gap-3">
            <a
              href="/playlist/esther-gabriel-2027"
              className="font-ui text-[10px] tracking-[0.2em] uppercase px-4 py-2 text-muted-foreground hover:text-primary transition-colors hidden sm:block"
            >
              Repertório
            </a>
            <a
              href="https://wa.me/5527999936682?text=Ol%C3%A1!%20Gostaria%20de%20aceitar%20a%20proposta%20musical%20para%20nosso%20casamento.%20Podemos%20conversar%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui text-[10px] tracking-[0.2em] uppercase px-5 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-sm"
            >
              Aceitar Proposta
            </a>
          </div>
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
