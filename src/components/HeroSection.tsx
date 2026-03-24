import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import heroBand from "@/assets/hero-band.jpg";
import ParticleField from "./ParticleField";

const HeroSection = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);

  useEffect(() => {
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll(".char");
      
      // Dramatic stagger: each char stroke-draws then fills
      gsap.set(chars, { opacity: 0, y: 120, rotationX: -90, scale: 0.5 });
      
      const tl = gsap.timeline({ delay: 0.8 });
      
      tl.to(chars, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        scale: 1,
        stagger: 0.04,
        duration: 1.2,
        ease: "back.out(1.7)",
      });

      // Glow pulse after reveal
      tl.to(chars, {
        textShadow: "0 0 40px hsla(43, 59%, 52%, 0.6), 0 0 80px hsla(43, 59%, 52%, 0.3)",
        stagger: 0.02,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.5");

      tl.to(chars, {
        textShadow: "0 0 0px transparent",
        stagger: 0.02,
        duration: 1.5,
        ease: "power2.out",
      }, "-=0.3");
    }

    // Animate decorative lines
    lineRefs.current.forEach((line, i) => {
      if (!line) return;
      const length = line.getTotalLength();
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(line, {
        strokeDashoffset: 0,
        duration: 2,
        delay: 1.5 + i * 0.3,
        ease: "power2.inOut",
      });
    });
  }, []);

  const splitText = (text: string) => {
    return text.split("").map((char, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{ willChange: "transform, opacity", perspective: "1000px" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBand}
          alt="Banda ao vivo em casamento"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      {/* Three.js Particles - mouse reactive */}
      <ParticleField />

      {/* Decorative SVG lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]" preserveAspectRatio="none">
        <line
          ref={(el) => { lineRefs.current[0] = el; }}
          x1="10%" y1="20%" x2="10%" y2="80%"
          stroke="hsl(43, 59%, 52%)" strokeWidth="0.5" opacity="0.15"
        />
        <line
          ref={(el) => { lineRefs.current[1] = el; }}
          x1="90%" y1="15%" x2="90%" y2="85%"
          stroke="hsl(43, 59%, 52%)" strokeWidth="0.5" opacity="0.15"
        />
        <line
          ref={(el) => { lineRefs.current[2] = el; }}
          x1="5%" y1="50%" x2="30%" y2="50%"
          stroke="hsl(43, 59%, 52%)" strokeWidth="0.5" opacity="0.1"
        />
        <line
          ref={(el) => { lineRefs.current[3] = el; }}
          x1="70%" y1="50%" x2="95%" y2="50%"
          stroke="hsl(43, 59%, 52%)" strokeWidth="0.5" opacity="0.1"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.4em" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="font-ui text-[10px] md:text-xs uppercase text-muted-foreground mb-10"
        >
          Uma Experiência Sonora Exclusiva
        </motion.p>

        <h1
          ref={titleRef}
          className="font-display text-7xl md:text-9xl lg:text-[12rem] font-light leading-[0.85] tracking-tight text-gold-gradient mb-4"
          style={{ perspective: "1000px" }}
        >
          {splitText("Esther")}
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.6, type: "spring" }}
            className="block text-3xl md:text-4xl lg:text-5xl text-foreground/30 font-light italic my-3"
          >
            &
          </motion.span>
          {splitText("Gabriel")}
        </h1>

        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 1.8, ease: [0.23, 1, 0.32, 1] }}
          className="w-px h-20 bg-primary mx-auto my-10 origin-top"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="space-y-3"
        >
          <p className="font-ui text-sm tracking-[0.25em] uppercase text-primary tabular-nums">
            13 · 03 · 2027
          </p>
          <p className="font-body text-sm text-muted-foreground/80">
            Ninho da Roxinha · 18h — 22h · 150 convidados
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          className="mt-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="text-muted-foreground/40"
          >
            <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
