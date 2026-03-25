import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-homemusic.png";

interface EntranceGateProps {
  onEnter: () => void;
}

const EntranceGate = ({ onEnter }: EntranceGateProps) => {
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 1200);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="gate"
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* Subtle ambient glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
              style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center gap-10 relative z-10 px-6 text-center"
          >
            {/* Logo */}
            <motion.img
              src={logo}
              alt="Home Music"
              className="h-12 md:h-16 w-auto opacity-60"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />

            {/* Names */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <p className="font-ui text-[9px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
                Uma experiência musical exclusiva para
              </p>
              <h1 className="font-display text-4xl md:text-6xl font-light text-foreground leading-tight">
                Esther <span className="text-gold-gradient">&</span> Gabriel
              </h1>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="w-24 h-px bg-primary/30 origin-center"
            />

            {/* CTA */}
            <motion.button
              onClick={handleEnter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="group relative px-10 py-4 rounded-sm border border-primary/50 hover:border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-[0_0_40px_hsla(43,59%,52%,0.25)]"
            >
              <span className="font-ui text-xs tracking-[0.25em] uppercase">
                Iniciar Experiência
              </span>
              <div className="absolute inset-0 rounded-sm breathing-glow pointer-events-none" />
            </motion.button>

            {/* Subtle hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2 }}
              className="font-body text-[11px] text-muted-foreground/60 max-w-xs text-center leading-relaxed"
            >
              Prepare-se para ver como será a trilha sonora do grande dia com a Home Music!
            </motion.p>
          </motion.div>

          {/* Exiting overlay */}
          {exiting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-background z-20"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntranceGate;
