import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ParticleField from "./ParticleField";
import logo from "@/assets/logo-homemusic.png";

interface EntranceGateProps {
  onEnter: () => void;
}

const EntranceGate = ({ onEnter }: EntranceGateProps) => {
  const [exiting, setExiting] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);

  useEffect(() => {
    // Animate title characters with GSAP like the Hero
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll(".char");
      gsap.set(chars, { opacity: 0, y: 60, rotationX: -90, scale: 0.5 });

      const tl = gsap.timeline({ delay: 0.8 });
      tl.to(chars, {
        opacity: 1, y: 0, rotationX: 0, scale: 1,
        stagger: 0.04, duration: 0.9, ease: "back.out(1.7)",
      });
      tl.to(chars, {
        textShadow: "0 0 40px hsla(43, 59%, 52%, 0.6), 0 0 80px hsla(43, 59%, 52%, 0.3)",
        stagger: 0.02, duration: 0.6, ease: "power2.out",
      }, "-=0.3");
      tl.to(chars, {
        textShadow: "0 0 0px transparent",
        stagger: 0.02, duration: 1, ease: "power2.out",
      }, "-=0.1");

      // Repeating glow
      gsap.to(chars, {
        textShadow: "0 0 30px hsla(43, 59%, 52%, 0.5), 0 0 60px hsla(43, 59%, 52%, 0.2)",
        stagger: 0.03, duration: 1, ease: "power2.inOut",
        yoyo: true, repeat: -1, repeatDelay: 6, delay: 4,
      });
    }

    // Decorative lines
    lineRefs.current.forEach((line, i) => {
      if (!line) return;
      const length = line.getTotalLength();
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(line, { strokeDashoffset: 0, duration: 2, delay: 0.5 + i * 0.3, ease: "power2.inOut" });
    });
  }, []);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 1400);
  };

  const splitText = (text: string) =>
    text.split("").map((char, i) => (
      <span key={i} className="char inline-block" style={{ willChange: "transform, opacity", perspective: "1000px" }}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="gate"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Particle field background */}
          <ParticleField />

          {/* Decorative SVG lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]" preserveAspectRatio="none">
            <line ref={(el) => { lineRefs.current[0] = el; }} x1="10%" y1="20%" x2="10%" y2="80%" stroke="hsl(43, 59%, 52%)" strokeWidth="0.5" opacity="0.15" />
            <line ref={(el) => { lineRefs.current[1] = el; }} x1="90%" y1="15%" x2="90%" y2="85%" stroke="hsl(43, 59%, 52%)" strokeWidth="0.5" opacity="0.15" />
            <line ref={(el) => { lineRefs.current[2] = el; }} x1="5%" y1="50%" x2="30%" y2="50%" stroke="hsl(43, 59%, 52%)" strokeWidth="0.5" opacity="0.1" />
            <line ref={(el) => { lineRefs.current[3] = el; }} x1="70%" y1="50%" x2="95%" y2="50%" stroke="hsl(43, 59%, 52%)" strokeWidth="0.5" opacity="0.1" />
          </svg>

          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
              style={{ background: "radial-gradient(circle, hsl(43, 59%, 52%), transparent 70%)" }}
            />
          </div>

          <div className="flex flex-col items-center gap-10 relative z-10 px-6 text-center">
            {/* Logo */}
            <motion.img
              src={logo}
              alt="Home Music"
              className="h-12 md:h-16 w-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.4em" }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-ui text-[9px] md:text-[10px] uppercase text-muted-foreground"
            >
              Uma experiência musical exclusiva para
            </motion.p>

            {/* Names with GSAP char animation */}
            <h1
              ref={titleRef}
              className="font-display text-5xl md:text-7xl font-light text-gold-gradient leading-tight"
            >
              {splitText("Esther & Gabriel")}
            </h1>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 1.8 }}
              className="w-24 h-px bg-primary/30 origin-center"
            />

            {/* CTA */}
            <motion.button
              onClick={handleEnter}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.2 }}
              className="group relative px-10 py-4 rounded-sm border border-primary/50 hover:border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-[0_0_40px_hsla(43,59%,52%,0.25)]"
            >
              <span className="font-ui text-xs tracking-[0.25em] uppercase">
                Iniciar Experiência
              </span>
              <div className="absolute inset-0 rounded-sm breathing-glow pointer-events-none" />
            </motion.button>

            {/* Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.8 }}
              className="font-body text-[11px] text-muted-foreground/60 max-w-xs text-center leading-relaxed"
            >
              Prepare-se para ver como será a trilha sonora do grande dia com a Home Music!
            </motion.p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="exit-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 z-[100] bg-background pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
};

export default EntranceGate;
