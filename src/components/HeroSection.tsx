import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import heroBand from "@/assets/hero-band.jpg";
import ParticleField from "./ParticleField";

const HeroSection = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // GSAP character reveal for title
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll(".char");
      gsap.from(chars, {
        opacity: 0,
        y: 80,
        rotationX: -90,
        stagger: 0.04,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.8,
      });
    }
  }, []);

  const splitText = (text: string) => {
    return text.split("").map((char, i) => (
      <span key={i} className="char inline-block" style={{ willChange: "transform, opacity" }}>
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

      {/* Three.js Particles */}
      <ParticleField />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-ui text-[10px] md:text-xs tracking-[0.4em] uppercase text-muted-foreground mb-10"
        >
          Uma Experiência Sonora Exclusiva
        </motion.p>

        <h1
          ref={titleRef}
          className="font-display text-7xl md:text-9xl lg:text-[12rem] font-light leading-[0.85] tracking-tight text-gold-gradient mb-4 perspective-1000"
        >
          {splitText("Esther")}
          <span className="block text-3xl md:text-4xl lg:text-5xl text-foreground/30 font-light italic my-3">&</span>
          {splitText("Gabriel")}
        </h1>

        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="w-px h-20 bg-primary mx-auto my-10 origin-top"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="space-y-3"
        >
          <p className="font-ui text-sm tracking-[0.25em] uppercase text-primary">
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
