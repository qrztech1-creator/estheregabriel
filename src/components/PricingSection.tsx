import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Disc3, Lightbulb, Volume2, Send, MessageCircle, AlertTriangle, Lock, Eye, Banknote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StrokeText from "./StrokeText";
import AnimatedBorderCard from "./AnimatedBorderCard";
import { useProposal } from "@/contexts/ProposalContext";
import carolPhoto from "@/assets/carol-suhet.png";

gsap.registerPlugin(ScrollTrigger);

const serviceIconMap: Record<string, any> = { Music, Disc3, Lightbulb, Volume2 };

const defaultIncluded = [
  { icon: "Music", text: "Show ao vivo da banda — 2 horas" },
  { icon: "Disc3", text: "DJ com playlist personalizada — 2 horas" },
  { icon: "Lightbulb", text: "Iluminação cênica para o palco", badge: "Cortesia" },
  { icon: "Volume2", text: "Sonorização completa para 150 convidados" },
];

const defaultTechDetails = [
  "Mesa de som digital", "Caixas ativas de alta potência", "Subwoofers",
  "Cabeamento completo", "Microfones profissionais", "Logística de montagem e desmontagem",
  "Suporte técnico durante o evento",
];

const defaultPlans = [
  { id: "banda-2h", label: "Banda 2h", description: "Show ao vivo 2h + música ambiente no restante", total: 8532, entry30: 8190.72, savings30: 341.28, entry50: 7678.80, savings50: 853.20, aVista: 7465.50, savingsAVista: 1066.50 },
  { id: "banda-2h-dj-2h", label: "Banda 2h + DJ 2h", description: "Show ao vivo 2h + DJ com playlist personalizada 2h", total: 9480, entry30: 8974.50, savings30: 505.50, entry50: 8498.53, savings50: 981.47, aVista: 8295.00, savingsAVista: 1185.00 },
  { id: "banda-2h-dj-3h", label: "Banda 2h + DJ 3h", description: "Show ao vivo 2h + DJ com playlist personalizada 3h", total: 10353, entry30: 9938.88, savings30: 414.12, entry50: 9317.70, savings50: 1035.30, aVista: 9058.88, savingsAVista: 1294.12 },
  { id: "banda-3h-dj-2h", label: "Banda 3h + DJ 2h", description: "Show ao vivo 3h + DJ com playlist personalizada 2h", total: 11984, entry30: 11504.64, savings30: 479.36, entry50: 10785.60, savings50: 1198.40, aVista: 10486.00, savingsAVista: 1498.00, recommended: true },
];

const formatBRL = (val: number) => {
  const [int, dec] = val.toFixed(2).split(".");
  return { int: parseInt(int).toLocaleString("pt-BR"), dec };
};

const PricingSection = () => {
  const proposal = useProposal();
  const plans = (proposal?.pricing_plans?.length ? proposal.pricing_plans : defaultPlans) as any[];
  const included = (proposal?.included_services?.length ? proposal.included_services : defaultIncluded) as any[];
  const techDetails = (proposal?.tech_details?.length ? proposal.tech_details : defaultTechDetails) as string[];
  const whatsappNumber = proposal?.whatsapp_number ?? "5527999936682";
  const partnershipName = proposal?.partnership_name ?? "Carol Suhet";
  const partnershipInstagram = proposal?.partnership_instagram ?? "https://www.instagram.com/carolsuhetcerimonialista/";
  const partnershipPhotoUrl = proposal?.partnership_photo_url;

  const priceRef = useRef<HTMLParagraphElement>(null);
  const [proposalTime, setProposalTime] = useState({ d: "0", h: "00", m: "00", s: "00" });
  const [revealed, setRevealed] = useState(false);

  const defaultIdx = plans.findIndex((p: any) => p.recommended);
  const [selectedPlan, setSelectedPlan] = useState(defaultIdx >= 0 ? defaultIdx : plans.length - 1);
  const plan = plans[selectedPlan];

  useEffect(() => {
    if (!revealed) return;
    const timer = setTimeout(() => {
      if (!priceRef.current) return;
      const target = { val: 0 };
      gsap.to(target, {
        val: plan.total, duration: 2, ease: "power2.out",
        onUpdate: () => { if (priceRef.current) priceRef.current.textContent = `R$ ${Math.round(target.val).toLocaleString("pt-BR")}`; },
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [revealed, selectedPlan, plan.total]);

  useEffect(() => {
    const deadlineStr = proposal?.proposal_deadline;
    if (!deadlineStr) return;
    const expiry = new Date(deadlineStr).getTime();
    const tick = () => {
      const diff = expiry - Date.now();
      if (diff <= 0) { setProposalTime({ d: "0", h: "00", m: "00", s: "00" }); return; }
      setProposalTime({
        d: String(Math.floor(diff / (1000 * 60 * 60 * 24))),
        h: String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0"),
        m: String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0"),
        s: String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0"),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [proposal?.proposal_deadline]);

  const e30 = formatBRL(plan.entry30 || 0);
  const e50 = formatBRL(plan.entry50 || 0);
  const eAV = formatBRL(plan.aVista || 0);

  // Use uploaded photo URL, or fallback to local carol-suhet asset if partnership is Carol Suhet
  const partnerPhotoSrc: string | null = partnershipPhotoUrl || (partnershipName?.includes("Carol Suhet") ? carolPhoto : null);

  return (
    <section className="py-12 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-ui text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">O Investimento na Noite Perfeita</motion.p>
          <StrokeText text="Nosso Combinado" fontSize="12rem" />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="glass-surface p-8 md:p-12 rounded-sm">
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {included.map((item: any) => {
              const Icon = serviceIconMap[item.icon] || Music;
              return (
                <div key={item.text} className="flex items-start gap-3 p-4 rounded-sm bg-secondary/30 hover:bg-secondary/50 transition-colors duration-150">
                  <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-body text-sm text-foreground">{item.text}</p>
                    {item.badge && <span className="font-ui text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm bg-primary/20 text-primary border border-primary/30">{item.badge}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mb-8">
            <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Estrutura técnica inclusa</p>
            <div className="flex flex-wrap gap-2">
              {techDetails.map((detail) => (
                <span key={detail} className="font-body text-xs px-3 py-1.5 rounded-sm bg-secondary/50 text-muted-foreground hover:bg-secondary/70 hover:text-foreground transition-colors duration-150">{detail}</span>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="border-t border-border pt-8">
                <div className="text-center py-6">
                  <div className="w-20 h-20 rounded-full border border-primary/30 mx-auto flex items-center justify-center mb-6 breathing-glow"><Lock className="w-8 h-8 text-primary" /></div>
                  <h3 className="font-display text-2xl md:text-3xl text-foreground font-light mb-3">Valores e Condições Especiais</h3>
                  <p className="font-body text-sm text-muted-foreground max-w-md mx-auto mb-2">Preparamos uma proposta exclusiva para o casamento de vocês.</p>
                  <p className="font-body text-xs text-primary/80 mb-8 flex items-center justify-center gap-2"><AlertTriangle className="w-3.5 h-3.5" />Ao visualizar, o contador será ativado.</p>
                  <button onClick={() => setRevealed(true)} className="inline-flex items-center gap-3 px-10 py-4 rounded-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 font-ui text-sm tracking-[0.15em] uppercase group hover:shadow-[0_0_30px_hsla(43,59%,52%,0.3)]">
                    <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-150" />Revelar Proposta
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="revealed" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }} className="border-t border-border pt-8">
                {partnershipName && (
                  <>
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary/10 border border-primary/20">
                        <span className="font-ui text-[10px] tracking-[0.2em] uppercase text-primary">Oferta em parceria com {partnershipName}</span>
                      </div>
                    </div>
                    {(partnerPhotoSrc || partnershipInstagram) && (
                      <div className="flex justify-center mb-8">
                        <a href={partnershipInstagram || "#"} target="_blank" rel="noopener noreferrer" className="group">
                          {partnerPhotoSrc ? (
                            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/40 ring-offset-2 ring-offset-background group-hover:ring-primary transition-all duration-300">
                              <img src={partnerPhotoSrc} alt={partnershipName} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/40 ring-offset-2 ring-offset-background group-hover:ring-primary transition-all duration-300">
                              <span className="font-display text-xl text-primary">{partnershipName[0]}</span>
                            </div>
                          )}
                        </a>
                      </div>
                    )}
                  </>
                )}

                <div className="mb-8">
                  <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 text-center">Escolha o formato ideal</p>
                  <div className={`grid gap-2 ${plans.length <= 3 ? 'grid-cols-1 sm:grid-cols-3 max-w-2xl mx-auto' : 'grid-cols-2 md:grid-cols-4'}`}>
                    {plans.map((p: any, i: number) => (
                      <button key={p.id || i} onClick={() => setSelectedPlan(i)}
                        className={`relative p-3 rounded-sm border text-center transition-all duration-200 ${selectedPlan === i ? "border-primary bg-primary/10 shadow-[0_0_20px_hsla(43,59%,52%,0.15)]" : "border-border hover:border-primary/40 bg-secondary/20 hover:bg-secondary/30"}`}>
                        {p.recommended && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 font-ui text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 bg-primary text-primary-foreground rounded-sm whitespace-nowrap">Recomendado</span>}
                        <p className={`font-ui text-[10px] tracking-[0.1em] uppercase ${selectedPlan === i ? "text-primary" : "text-muted-foreground"}`}>{p.label}</p>
                        <p className="font-display text-lg text-foreground font-light mt-1">R$ {(p.total || 0).toLocaleString("pt-BR")}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="font-body text-sm text-muted-foreground mb-2">{plan.description}</p>
                  <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Valor total do investimento</p>
                  <p ref={priceRef} className="font-display text-5xl md:text-7xl font-light text-gold-gradient tabular-nums">R$ {(plan.total || 0).toLocaleString("pt-BR")}</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-6 max-w-3xl mx-auto">
                  <AnimatedBorderCard delay={0.1}>
                    <div className="p-5 text-center hover:bg-secondary/20 transition-colors duration-150 rounded-sm">
                      <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Entrada de 30%</p>
                      <p className="font-display text-2xl md:text-3xl text-foreground font-light">R$ {e30.int}<span className="text-base">,{e30.dec}</span></p>
                      <p className="font-body text-xs text-primary mt-2">Economia de R$ {formatBRL(plan.savings30 || 0).int},{formatBRL(plan.savings30 || 0).dec}</p>
                    </div>
                  </AnimatedBorderCard>
                  <AnimatedBorderCard delay={0.2}>
                    <div className="p-5 text-center relative overflow-hidden hover:bg-secondary/20 transition-colors duration-150 rounded-sm">
                      <div className="absolute top-0 right-0 bg-primary px-2 py-0.5"><p className="font-ui text-[9px] tracking-wider uppercase text-primary-foreground">Mais popular</p></div>
                      <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Entrada de 50%</p>
                      <p className="font-display text-2xl md:text-3xl text-foreground font-light">R$ {e50.int}<span className="text-base">,{e50.dec}</span></p>
                      <p className="font-body text-xs text-primary mt-2">Economia de R$ {formatBRL(plan.savings50 || 0).int},{formatBRL(plan.savings50 || 0).dec}</p>
                    </div>
                  </AnimatedBorderCard>
                  <AnimatedBorderCard delay={0.3}>
                    <div className="p-5 text-center relative overflow-hidden hover:bg-secondary/20 transition-colors duration-150 rounded-sm">
                      <div className="absolute top-0 right-0 bg-primary px-2 py-0.5"><p className="font-ui text-[9px] tracking-wider uppercase text-primary-foreground flex items-center gap-1"><Banknote className="w-3 h-3" /> Melhor preço</p></div>
                      <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">À Vista</p>
                      <p className="font-display text-2xl md:text-3xl text-foreground font-light">R$ {eAV.int}<span className="text-base">,{eAV.dec}</span></p>
                      <p className="font-body text-xs text-primary mt-2">Economia de R$ {formatBRL(plan.savingsAVista || 0).int},{formatBRL(plan.savingsAVista || 0).dec}</p>
                    </div>
                  </AnimatedBorderCard>
                </div>

                {proposal?.proposal_deadline && (
                  <div className="mb-6">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="border border-destructive/40 bg-destructive/5 rounded-sm p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
                        <p className="font-ui text-xs tracking-[0.2em] uppercase text-destructive">Proposta válida por tempo limitado</p>
                      </div>
                      <div className="flex items-center justify-center gap-4 mb-3">
                        {[{ val: proposalTime.d, label: "Dias" }, { val: proposalTime.h, label: "Horas" }, { val: proposalTime.m, label: "Min" }, { val: proposalTime.s, label: "Seg" }].map((u) => (
                          <div key={u.label} className="text-center">
                            <span className="font-display text-3xl md:text-4xl text-destructive tabular-nums font-light">{u.val}</span>
                            <p className="font-ui text-[8px] tracking-[0.15em] uppercase text-muted-foreground mt-1">{u.label}</p>
                          </div>
                        ))}
                      </div>
                      <p className="font-body text-xs text-muted-foreground">Condições especiais válidas durante este período.</p>
                    </motion.div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href={`/proposta/${proposal?.slug}/resumo`}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-sm bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsla(43,59%,52%,0.4)] transition-all duration-150 font-ui text-xs tracking-[0.15em] uppercase group font-bold">
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />RESUMIR MINHA PROPOSTA
                  </a>
                  <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá! Vi a proposta no site e tenho algumas dúvidas. Podemos conversar?")}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-sm border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-150 font-ui text-xs tracking-[0.15em] uppercase">
                    <MessageCircle className="w-4 h-4" />Tenho dúvidas
                  </a>
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
