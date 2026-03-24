import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="font-display text-[15vw] md:text-[12vw] leading-none font-light text-gold-gradient opacity-20 select-none">
            E & G
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="-mt-12 md:-mt-16"
        >
          <p className="font-display text-2xl md:text-3xl text-foreground font-light mb-2">
            Home Music
          </p>
          <p className="font-body text-sm text-muted-foreground mb-6">
            Curadoria musical para momentos que merecem ser inesquecíveis
          </p>
          <a
            href="https://wa.me/5527999936682?text=Ol%C3%A1!%20Vi%20a%20proposta%20no%20site%20e%20gostaria%20de%20conversar."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-ui text-xs tracking-[0.2em] uppercase text-primary hover:text-foreground transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            (27) 99993-6682
          </a>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
