import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ParticleField from "./ParticleField";
import { useProposal } from "@/contexts/ProposalContext";

import hero1 from "@/assets/hero-1.png";
import hero2 from "@/assets/hero-2.png";
import hero3 from "@/assets/hero-3.png";
import hero4 from "@/assets/hero-4.png";
import hero5 from "@/assets/hero-5.png";
import hero6 from "@/assets/hero-6.png";
import hero7 from "@/assets/hero-7.png";
import hero8 from "@/assets/hero-8.png";

const heroImages = [hero1, hero2, hero3, hero4, hero5, hero6, hero7, hero8];

const HeroSection = () => {
  const proposal = useProposal();
  const brideName = proposal?.bride_name ?? "Esther";
  const groomName = proposal?.groom_name ?? "Gabriel";
  const brideInitial = brideName[0] ?? "E";
  const groomInitial = groomName[0] ?? "G";
  const eventDate = proposal?.event_date ? new Date(proposal.event_date + "T12:00:00") : new Date("2027-03-13T12:00:00");
  const venueName = proposal?.venue_name ?? "Ninho da Roxinha";
  const startTime = proposal?.event_start_time ?? "18:00";
  const endTime = proposal?.event_end_time ?? "22:00";
  const guestCount = proposal?.guest_count ?? 150;

  const dateStr = `${eventDate.getDate().toString().padStart(2, "0")} · ${(eventDate.getMonth() + 1).toString().padStart(2, "0")} · ${eventDate.getFullYear()}`;

  const titleRef = useRef<HTMLHeadingElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const countdownRef = useRef<HTMLDivElement>(null);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const weddingDate = new Date(`${proposal?.event_date ?? "2027-03-13"}T${startTime}:00`).getTime();

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = weddingDate - now;
      if (diff <= 0 || !countdownRef.current) return;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const els = countdownRef.current.querySelectorAll(".countdown-num");
      if (els[0]) els[0].textContent = String(days).padStart(3, "0");
      if (els[1]) els[1].textContent = String(hours).padStart(2, "0");
      if (els[2]) els[2].textContent = String(minutes).padStart(2, "0");
      if (els[3]) els[3].textContent = String(seconds).padStart(2, "0");
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  useEffect(() => {
    if (logoRef.current) {
      const paths = logoRef.current.querySelectorAll(".logo-letter");
      const decorPaths = logoRef.current.querySelectorAll(".logo-decor");

      paths.forEach((path) => {
        const el = path as SVGPathElement;
        const length = el.getTotalLength?.() || 500;
        gsap.set(el, {
          strokeDasharray: length, strokeDashoffset: length,
          fill: "transparent", stroke: "hsl(43, 59%, 52%)", strokeWidth: 1.5,
        });
      });

      gsap.set(decorPaths, { opacity: 0, scale: 0 });

      const logoTl = gsap.timeline({ delay: 0.3 });
      logoTl.to(paths, { strokeDashoffset: 0, duration: 2.5, stagger: 0.3, ease: "power2.inOut" });
      logoTl.to(paths, { fill: "hsl(43, 59%, 52%)", strokeWidth: 0, duration: 1.2, stagger: 0.15, ease: "power2.out" }, "-=0.8");
      logoTl.to(decorPaths, { opacity: 0.4, scale: 1, stagger: 0.1, duration: 0.8, ease: "back.out(2)" }, "-=0.5");
    }

    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll(".char");
      gsap.set(chars, { opacity: 0, y: 80, rotationX: -90, scale: 0.5 });
      const tl = gsap.timeline({ delay: 2.8 });
      tl.to(chars, { opacity: 1, y: 0, rotationX: 0, scale: 1, stagger: 0.03, duration: 0.9, ease: "back.out(1.7)" });
      tl.to(chars, { textShadow: "0 0 40px hsla(43, 59%, 52%, 0.6), 0 0 80px hsla(43, 59%, 52%, 0.3)", stagger: 0.02, duration: 0.6, ease: "power2.out" }, "-=0.3");
      tl.to(chars, { textShadow: "0 0 0px transparent", stagger: 0.02, duration: 1, ease: "power2.out" }, "-=0.1");
      gsap.to(chars, { textShadow: "0 0 30px hsla(43, 59%, 52%, 0.5), 0 0 60px hsla(43, 59%, 52%, 0.2)", stagger: 0.03, duration: 1, ease: "power2.inOut", yoyo: true, repeat: -1, repeatDelay: 8, delay: 6 });
    }

    lineRefs.current.forEach((line, i) => {
      if (!line) return;
      const length = line.getTotalLength();
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(line, { strokeDashoffset: 0, duration: 2, delay: 1.5 + i * 0.3, ease: "power2.inOut" });
    });

    if (logoRef.current) {
      const paths = logoRef.current.querySelectorAll(".logo-letter");
      const replayLogo = () => {
        const reTl = gsap.timeline();
        reTl.to(paths, { fill: "transparent", strokeWidth: 1.5, strokeDashoffset: (i: number, el: SVGPathElement) => el.getTotalLength?.() || 500, duration: 0.5, ease: "power2.in" });
        reTl.to(paths, { strokeDashoffset: 0, duration: 2, stagger: 0.2, ease: "power2.inOut" });
        reTl.to(paths, { fill: "hsl(43, 59%, 52%)", strokeWidth: 0, duration: 1, stagger: 0.1, ease: "power2.out" }, "-=0.5");
      };
      const logoInterval = setInterval(replayLogo, 10000);
      return () => clearInterval(logoInterval);
    }
  }, []);

  const splitText = (text: string) =>
    text.split("").map((char, i) => (
      <span key={i} className="char inline-block" style={{ willChange: "transform, opacity", perspective: "1000px" }}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <section className="relative h-screen max-h-[750px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImg}
            src={heroImages[currentImg]}
            alt="Home Music ao vivo"
            className="w-full h-full object-cover absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            width={1920} height={1080}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <ParticleField />

      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]" preserveAspectRatio="none">
        <line ref={(el) => { lineRefs.current[0] = el; }} x1="10%" y1="20%" x2="10%" y2="80%" stroke="hsl(43, 59%, 52%)" strokeWidth="0.5" opacity="0.15" />
        <line ref={(el) => { lineRefs.current[1] = el; }} x1="90%" y1="15%" x2="90%" y2="85%" stroke="hsl(43, 59%, 52%)" strokeWidth="0.5" opacity="0.15" />
        <line ref={(el) => { lineRefs.current[2] = el; }} x1="5%" y1="50%" x2="30%" y2="50%" stroke="hsl(43, 59%, 52%)" strokeWidth="0.5" opacity="0.1" />
        <line ref={(el) => { lineRefs.current[3] = el; }} x1="70%" y1="50%" x2="95%" y2="50%" stroke="hsl(43, 59%, 52%)" strokeWidth="0.5" opacity="0.1" />
      </svg>

      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.4em" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="font-ui text-[10px] md:text-xs uppercase text-muted-foreground mb-6"
        >
          Uma Experiência Sonora Exclusiva
        </motion.p>

        <div className="flex justify-center mb-4">
          <svg ref={logoRef} viewBox="0 0 300 120" className="w-40 md:w-56 lg:w-64" style={{ overflow: "visible" }}>
            <text className="logo-letter" x="75" y="95" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="110" fontWeight="300" fill="transparent" stroke="hsl(43, 59%, 52%)" strokeWidth="1.5">{brideInitial}</text>
            <text className="logo-decor" x="150" y="85" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="40" fontWeight="300" fontStyle="italic" fill="hsl(43, 59%, 52%)" opacity="0">&amp;</text>
            <text className="logo-letter" x="225" y="95" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="110" fontWeight="300" fill="transparent" stroke="hsl(43, 59%, 52%)" strokeWidth="1.5">{groomInitial}</text>
            <line className="logo-decor" x1="30" y1="105" x2="120" y2="105" stroke="hsl(43, 59%, 52%)" strokeWidth="0.5" opacity="0" />
            <line className="logo-decor" x1="180" y1="105" x2="270" y2="105" stroke="hsl(43, 59%, 52%)" strokeWidth="0.5" opacity="0" />
          </svg>
        </div>

        <h1 ref={titleRef} className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] tracking-tight mb-3 whitespace-nowrap" style={{ perspective: "1000px" }}>
          <span className="text-primary">{splitText(brideName)}</span>
          <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 3.2, type: "spring" }} className="inline-block text-2xl md:text-3xl text-primary/40 font-light italic mx-3 md:mx-5 align-middle">&</motion.span>
          <span className="text-primary">{splitText(groomName)}</span>
        </h1>

        <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1, delay: 3.6, ease: [0.23, 1, 0.32, 1] }} className="w-px h-8 bg-primary mx-auto my-4 origin-top" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 4 }} className="space-y-1">
          <p className="font-ui text-sm tracking-[0.25em] uppercase text-primary tabular-nums">{dateStr}</p>
          <p className="font-body text-xs text-muted-foreground/80">{venueName} · {startTime}h — {endTime}h · {guestCount} convidados</p>
        </motion.div>

        <motion.div ref={countdownRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 4.4 }} className="mt-4 flex items-center justify-center gap-3 md:gap-5">
          {[
            { label: "Dias", key: "d" },
            { label: "Horas", key: "h" },
            { label: "Min", key: "m" },
            { label: "Seg", key: "s" },
          ].map((unit, i) => (
            <div key={unit.key} className="text-center">
              <div className="glass-surface px-3 py-2 md:px-4 md:py-3 rounded-sm gold-border-glow">
                <span className="countdown-num font-display text-2xl md:text-3xl text-gold-gradient tabular-nums font-light">
                  {i === 0 ? "000" : "00"}
                </span>
              </div>
              <p className="font-ui text-[8px] md:text-[9px] tracking-[0.2em] uppercase text-muted-foreground mt-1.5">{unit.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 5 }} className="mt-5">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} className="text-muted-foreground/40">
            <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
