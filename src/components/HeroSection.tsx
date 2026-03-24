import { motion } from "framer-motion";
import heroBand from "@/assets/hero-band.jpg";

const HeroSection = () => {
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
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-ui text-xs tracking-[0.3em] uppercase text-muted-foreground mb-8"
        >
          Uma proposta exclusiva para
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="font-display text-6xl md:text-8xl lg:text-[10rem] font-light leading-[0.9] tracking-tight text-gold-gradient mb-6"
        >
          Esther
          <span className="block text-3xl md:text-4xl lg:text-5xl text-foreground/40 font-light italic my-2">&</span>
          Gabriel
        </motion.h1>

        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="w-px h-16 bg-primary mx-auto my-8 origin-top"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="space-y-2"
        >
          <p className="font-ui text-sm tracking-[0.2em] uppercase text-primary">
            13 de Março de 2027
          </p>
          <p className="font-body text-sm text-muted-foreground">
            Ninho da Roxinha · 18:00 às 22:00 · 150 convidados
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-muted-foreground"
          >
            <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
