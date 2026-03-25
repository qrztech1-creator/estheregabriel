import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Music, Disc3, Lightbulb, Volume2, Send, MessageCircle, Clock, AlertTriangle } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StrokeText from "./StrokeText";
import AnimatedBorderCard from "./AnimatedBorderCard";

gsap.registerPlugin(ScrollTrigger);

const included = [
  { icon: Music, text: "Show ao vivo da banda — 2 horas" },
  { icon: Disc3, text: "DJ com playlist personalizada — 2 horas" },
  { icon: Lightbulb, text: "Iluminação cênica para o palco" },
  { icon: Volume2, text: "Sonorização completa para 150 convidados" },
];

const techDetails = [
  "Mesa de som digital",
  "Caixas ativas de alta potência",
  "Subwoofers",
  "Cabeamento completo",
  "Microfones profissionais",
  "Logística de montagem e desmontagem",
  "Suporte técnico durante o evento",
];

const PricingSection = () => {
  const priceRef = useRef<HTMLParagraphElement>(null);
  const countdownSectionRef = useRef<HTMLDivElement>(null);
  const [proposalExpiry, setProposalExpiry] = useState<number | null>(null);
  const [proposalTime, setProposalTime] = useState({ h: "48", m: "00", s: "00" });
  const [countdownStarted, setCountdownStarted] = useState(false);

  useEffect(() => {
    if (!priceRef.current) return;

    const target = { val: 0 };
    gsap.to(target, {
      val: 8850,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: priceRef.current,
        start: "top 80%",
      },
      onUpdate: () => {
        if (priceRef.current) {
          priceRef.current.textContent = `R$ ${Math.round(target.val).toLocaleString("pt-BR")}`;
        }
      },
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  // 48h countdown - activate when section enters viewport
  useEffect(() => {
    if (!countdownSectionRef.current) return;

    const storageKey = "proposal_expiry_eg2027";
    const stored = localStorage.getItem(storageKey);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countdownStarted) {
            let expiry: number;
            if (stored) {
              expiry = parseInt(stored, 10);
            } else {
              expiry = Date.now() + 48 * 60 * 60 * 1000;
              localStorage.setItem(storageKey, String(expiry));
            }
            setProposalExpiry(expiry);
            setCountdownStarted(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(countdownSectionRef.current);
    return () => observer.disconnect();
  }, [countdownStarted]);

  useEffect(() => {
    if (!proposalExpiry) return;

    const tick = () => {
      const diff = proposalExpiry - Date.now();
      if (diff <= 0) {
        setProposalTime({ h: "00", m: "00", s: "00" });
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setProposalTime({
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [proposalExpiry]);

  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-ui text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4"
          >
            O Investimento na Noite Perfeita
          </motion.p>

          <StrokeText text="Feche Agora" fontSize="8rem" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-surface p-8 md:p-12 rounded-sm"
        >
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {included.map((item) => (
              <div key={item.text} className="flex items-start gap-3 p-4 rounded-sm bg-secondary/30">
                <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="font-body text-sm text-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mb-10">
            <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Estrutura técnica inclusa
            </p>
            <div className="flex flex-wrap gap-2">
              {techDetails.map((detail) => (
                <span key={detail} className="font-body text-xs px-3 py-1.5 rounded-sm bg-secondary/50 text-muted-foreground">
                  {detail}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="border-t border-border pt-10">
            <div className="text-center mb-8">
              <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Valor total do investimento
              </p>
              <p ref={priceRef} className="font-display text-5xl md:text-7xl font-light text-gold-gradient tabular-nums">
                R$ 0
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <AnimatedBorderCard delay={0.1}>
                <div className="p-6 text-center">
                  <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                    Entrada de 30%
                  </p>
                  <p className="font-display text-3xl text-foreground font-light">R$ 8.374<span className="text-lg">,75</span></p>
                  <p className="font-body text-xs text-primary mt-2">Economia de R$ 475,25</p>
                </div>
              </AnimatedBorderCard>
              <AnimatedBorderCard delay={0.3}>
                <div className="p-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary px-3 py-1">
                    <p className="font-ui text-[10px] tracking-wider uppercase text-primary-foreground">Melhor valor</p>
                  </div>
                  <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                    Entrada de 50%
                  </p>
                  <p className="font-display text-3xl text-foreground font-light">R$ 7.865</p>
                  <p className="font-body text-xs text-primary mt-2">Economia de R$ 985,00</p>
                </div>
              </AnimatedBorderCard>
            </div>

            {/* 48h Urgency Countdown */}
            <div ref={countdownSectionRef} className="mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="border border-destructive/40 bg-destructive/5 rounded-sm p-6 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <p className="font-ui text-xs tracking-[0.2em] uppercase text-destructive">
                    Condições especiais por tempo limitado
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4 mb-3">
                  {[
                    { val: proposalTime.h, label: "Horas" },
                    { val: proposalTime.m, label: "Min" },
                    { val: proposalTime.s, label: "Seg" },
                  ].map((u) => (
                    <div key={u.label} className="text-center">
                      <span className="font-display text-3xl md:text-4xl text-destructive tabular-nums font-light">
                        {u.val}
                      </span>
                      <p className="font-ui text-[8px] tracking-[0.15em] uppercase text-muted-foreground mt-1">
                        {u.label}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="font-body text-xs text-muted-foreground">
                  Após esse prazo, os valores e descontos podem ser alterados.
                </p>
              </motion.div>
            </div>

            <div className="text-center space-y-3">
              <a
                href="https://wa.me/5527999936682?text=Ol%C3%A1!%20Gostaria%20de%20aceitar%20a%20proposta%20musical%20para%20nosso%20casamento%20no%20valor%20de%20R%24%208.850.%20Podemos%20alinhar%20os%20pr%C3%B3ximos%20passos%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 breathing-glow font-ui text-sm tracking-[0.15em] uppercase"
              >
                <Send className="w-4 h-4" />
                Aceitar Proposta
              </a>
              <div>
                <a
                  href="https://wa.me/5527999936682?text=Ol%C3%A1!%20Tenho%20algumas%20d%C3%BAvidas%20sobre%20a%20proposta%20musical.%20Podemos%20conversar%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-150 font-ui text-[10px] tracking-[0.15em] uppercase"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Tenho dúvidas
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
