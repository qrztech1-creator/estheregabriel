import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Disc3, Lightbulb, Volume2, Send, MessageCircle, AlertTriangle, Lock, Eye, Banknote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StrokeText from "./StrokeText";
import AnimatedBorderCard from "./AnimatedBorderCard";
import carolSuhetImg from "@/assets/carol-suhet.png";

gsap.registerPlugin(ScrollTrigger);

const included = [
  { icon: Music, text: "Show ao vivo da banda — 2 horas" },
  { icon: Disc3, text: "DJ com playlist personalizada — 2 horas" },
  { icon: Lightbulb, text: "Iluminação cênica para o palco", badge: "Cortesia" },
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

interface PricingPlan {
  id: string;
  label: string;
  description: string;
  total: number;
  entry30: number;
  savings30: number;
  entry50: number;
  savings50: number;
  aVista: number;
  savingsAVista: number;
  recommended?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: "banda-2h",
    label: "Banda 2h",
    description: "Show ao vivo 2h + música ambiente no restante",
    total: 8532,
    entry30: 8190.72,
    savings30: 341.28,
    entry50: 7678.80,
    savings50: 853.20,
    aVista: 7465.50,
    savingsAVista: 1066.50,
  },
  {
    id: "banda-2h-dj-2h",
    label: "Banda 2h + DJ 2h",
    description: "Show ao vivo 2h + DJ com playlist personalizada 2h",
    total: 9480,
    entry30: 8974.50,
    savings30: 505.50,
    entry50: 8498.53,
    savings50: 981.47,
    aVista: 8295.00,
    savingsAVista: 1185.00,
    recommended: true,
  },
  {
    id: "banda-2h-dj-3h",
    label: "Banda 2h + DJ 3h",
    description: "Show ao vivo 2h + DJ com playlist personalizada 3h",
    total: 10353,
    entry30: 9938.88,
    savings30: 414.12,
    entry50: 9317.70,
    savings50: 1035.30,
    aVista: 9058.88,
    savingsAVista: 1294.12,
  },
  {
    id: "banda-3h-dj-2h",
    label: "Banda 3h + DJ 2h",
    description: "Show ao vivo 3h + DJ com playlist personalizada 2h",
    total: 11984,
    entry30: 11504.64,
    savings30: 479.36,
    entry50: 10785.60,
    savings50: 1198.40,
    aVista: 10486.00,
    savingsAVista: 1498.00,
  },
];

const formatBRL = (val: number) => {
  const [int, dec] = val.toFixed(2).split(".");
  const formattedInt = parseInt(int).toLocaleString("pt-BR");
  return { int: formattedInt, dec };
};

const PricingSection = () => {
  const priceRef = useRef<HTMLParagraphElement>(null);
  const countdownSectionRef = useRef<HTMLDivElement>(null);
  const [proposalExpiry, setProposalExpiry] = useState<number | null>(null);
  const [proposalTime, setProposalTime] = useState({ d: "0", h: "00", m: "00", s: "00" });
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(1); // default to recommended

  const plan = plans[selectedPlan];

  // Price counter animation
  useEffect(() => {
    if (!revealed) return;

    const timer = setTimeout(() => {
      if (!priceRef.current) return;
      const target = { val: 0 };
      gsap.to(target, {
        val: plan.total,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          if (priceRef.current) {
            priceRef.current.textContent = `R$ ${Math.round(target.val).toLocaleString("pt-BR")}`;
          }
        },
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [revealed, selectedPlan, plan.total]);

  // Fixed deadline countdown: 01/04/2026 at 10:00 BRT (UTC-3)
  useEffect(() => {
    if (!revealed || countdownStarted) return;
    // April 1, 2026 at 10:00 BRT = 13:00 UTC
    const expiry = new Date("2026-04-01T13:00:00Z").getTime();
    setProposalExpiry(expiry);
    setCountdownStarted(true);
  }, [revealed, countdownStarted]);

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

  const e30 = formatBRL(plan.entry30);
  const e50 = formatBRL(plan.entry50);
  const eAV = formatBRL(plan.aVista);

  return (
    <section className="py-12 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-ui text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4"
          >
            O Investimento na Noite Perfeita
          </motion.p>
          <StrokeText text="Nosso Combinado" fontSize="12rem" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-surface p-8 md:p-12 rounded-sm"
        >
          {/* Services included */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {included.map((item) => (
              <div key={item.text} className="flex items-start gap-3 p-4 rounded-sm bg-secondary/30 hover:bg-secondary/50 transition-colors duration-150">
                <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-body text-sm text-foreground">{item.text}</p>
                  {"badge" in item && item.badge && (
                    <span className="font-ui text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm bg-primary/20 text-primary border border-primary/30">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Estrutura técnica inclusa
            </p>
            <div className="flex flex-wrap gap-2">
              {techDetails.map((detail) => (
                <span key={detail} className="font-body text-xs px-3 py-1.5 rounded-sm bg-secondary/50 text-muted-foreground hover:bg-secondary/70 hover:text-foreground transition-colors duration-150">
                  {detail}
                </span>
              ))}
            </div>
          </div>

          {/* REVEAL GATE */}
          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.div
                key="locked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="border-t border-border pt-8"
              >
                <div className="text-center py-6">
                  <div className="w-20 h-20 rounded-full border border-primary/30 mx-auto flex items-center justify-center mb-6 breathing-glow">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl text-foreground font-light mb-3">
                    Valores e Condições Especiais
                  </h3>
                  <p className="font-body text-sm text-muted-foreground max-w-md mx-auto mb-2">
                    Preparamos uma proposta exclusiva para o casamento de vocês.
                  </p>
                  <p className="font-body text-xs text-primary/80 mb-8 flex items-center justify-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Ao visualizar, o contador de 48h para condições especiais será ativado.
                  </p>
                  <button
                    onClick={() => setRevealed(true)}
                    className="inline-flex items-center gap-3 px-10 py-4 rounded-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 font-ui text-sm tracking-[0.15em] uppercase group hover:shadow-[0_0_30px_hsla(43,59%,52%,0.3)]"
                  >
                    <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-150" />
                    Revelar Proposta
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="border-t border-border pt-8"
              >
                {/* Partnership badge */}
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary/10 border border-primary/20">
                    <span className="font-ui text-[10px] tracking-[0.2em] uppercase text-primary">
                      Oferta em parceria com Carol Suhet
                    </span>
                  </div>
                </div>

                {/* Carol Suhet photo */}
                <div className="flex justify-center mb-8">
                  <a
                    href="https://www.instagram.com/carolsuhetcerimonialista/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/40 ring-offset-2 ring-offset-background group-hover:ring-primary transition-all duration-300">
                      <img src={carolSuhetImg} alt="Carol Suhet - Cerimonialista" className="w-full h-full object-cover" />
                    </div>
                  </a>
                </div>

                {/* Plan selector tabs */}
                <div className="mb-8">
                  <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 text-center">
                    Escolha o formato ideal
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {plans.map((p, i) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPlan(i)}
                        className={`relative p-3 rounded-sm border text-center transition-all duration-200 ${
                          selectedPlan === i
                            ? "border-primary bg-primary/10 shadow-[0_0_20px_hsla(43,59%,52%,0.15)]"
                            : "border-border hover:border-primary/40 bg-secondary/20 hover:bg-secondary/30"
                        }`}
                      >
                        {p.recommended && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 font-ui text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 bg-primary text-primary-foreground rounded-sm whitespace-nowrap">
                            Recomendado
                          </span>
                        )}
                        <p className={`font-ui text-[10px] tracking-[0.1em] uppercase ${selectedPlan === i ? "text-primary" : "text-muted-foreground"}`}>
                          {p.label}
                        </p>
                        <p className="font-display text-lg text-foreground font-light mt-1">
                          R$ {p.total.toLocaleString("pt-BR")}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected plan description */}
                <div className="text-center mb-6">
                  <p className="font-body text-sm text-muted-foreground mb-2">{plan.description}</p>
                  <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                    Valor total do investimento
                  </p>
                  <p ref={priceRef} className="font-display text-5xl md:text-7xl font-light text-gold-gradient tabular-nums">
                    R$ {plan.total.toLocaleString("pt-BR")}
                  </p>
                </div>

                {/* Payment options: 3 cards */}
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <AnimatedBorderCard delay={0.1}>
                    <div className="p-5 text-center hover:bg-secondary/20 transition-colors duration-150 rounded-sm">
                      <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                        Entrada de 30%
                      </p>
                      <p className="font-display text-2xl md:text-3xl text-foreground font-light">
                        R$ {e30.int}<span className="text-base">,{e30.dec}</span>
                      </p>
                      <p className="font-body text-xs text-primary mt-2">
                        Economia de R$ {formatBRL(plan.savings30).int},{formatBRL(plan.savings30).dec}
                      </p>
                    </div>
                  </AnimatedBorderCard>
                  <AnimatedBorderCard delay={0.2}>
                    <div className="p-5 text-center relative overflow-hidden hover:bg-secondary/20 transition-colors duration-150 rounded-sm">
                      <div className="absolute top-0 right-0 bg-primary px-2 py-0.5">
                        <p className="font-ui text-[9px] tracking-wider uppercase text-primary-foreground">Mais popular</p>
                      </div>
                      <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                        Entrada de 50%
                      </p>
                      <p className="font-display text-2xl md:text-3xl text-foreground font-light">
                        R$ {e50.int}<span className="text-base">,{e50.dec}</span>
                      </p>
                      <p className="font-body text-xs text-primary mt-2">
                        Economia de R$ {formatBRL(plan.savings50).int},{formatBRL(plan.savings50).dec}
                      </p>
                    </div>
                  </AnimatedBorderCard>
                  <AnimatedBorderCard delay={0.3}>
                    <div className="p-5 text-center relative overflow-hidden hover:bg-secondary/20 transition-colors duration-150 rounded-sm">
                      <div className="absolute top-0 right-0 bg-primary px-2 py-0.5">
                        <p className="font-ui text-[9px] tracking-wider uppercase text-primary-foreground flex items-center gap-1">
                          <Banknote className="w-3 h-3" /> Melhor preço
                        </p>
                      </div>
                      <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                        À Vista
                      </p>
                      <p className="font-display text-2xl md:text-3xl text-foreground font-light">
                        R$ {eAV.int}<span className="text-base">,{eAV.dec}</span>
                      </p>
                      <p className="font-body text-xs text-primary mt-2">
                        Economia de R$ {formatBRL(plan.savingsAVista).int},{formatBRL(plan.savingsAVista).dec}
                      </p>
                    </div>
                  </AnimatedBorderCard>
                </div>

                {/* 48h Urgency Countdown */}
                <div ref={countdownSectionRef} className="mb-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="border border-destructive/40 bg-destructive/5 rounded-sm p-6 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
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
                    href={`https://wa.me/5527999936682?text=${encodeURIComponent(`Olá! Gostaria de aceitar a proposta musical "${plan.label}" para nosso casamento no valor de R$ ${plan.total.toLocaleString("pt-BR")}. Podemos alinhar os próximos passos?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-10 py-4 rounded-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 breathing-glow font-ui text-sm tracking-[0.15em] uppercase hover:shadow-[0_0_30px_hsla(43,59%,52%,0.3)]"
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
