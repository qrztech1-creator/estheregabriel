import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ListMusic, Users, Mic2, PartyPopper, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StrokeText from "./StrokeText";
import { useProposal } from "@/contexts/ProposalContext";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, any> = { CalendarDays, ListMusic, Users, Mic2, PartyPopper, CheckCircle2 };

const defaultSteps = [
  { icon: "CheckCircle2", title: "Fechamento do Contrato", date: "Março 2026", description: "Assinatura e entrada. Definição das preferências iniciais de repertório.", active: true },
  { icon: "ListMusic", title: "Definição de Repertório", date: "Abril — Junho 2026", description: "Vocês montam a playlist do DJ e sugerem músicas para a banda." },
  { icon: "Users", title: "Reunião de Alinhamento", date: "Setembro 2026", description: "Encontro para alinhar detalhes finais: setlist, ordem das músicas, momentos especiais." },
  { icon: "Mic2", title: "Ensaio & Preparação", date: "Fevereiro 2027", description: "Banda ensaia o repertório final." },
  { icon: "CalendarDays", title: "Passagem de Som", date: "13/03/2027 — Manhã", description: "Montagem da estrutura, passagem de som e teste de iluminação." },
  { icon: "PartyPopper", title: "O Grande Dia", date: "13/03/2027 — 18:00", description: "Tudo pronto. A noite perfeita começa. Hora de celebrar!" },
];

const ProcessTimeline = () => {
  const proposal = useProposal();
  const steps = (proposal?.process_steps?.length ? proposal.process_steps : defaultSteps) as any[];
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    nodeRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el, { rotationX: 90, opacity: 0, scale: 0.5 }, {
        rotationX: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)",
        scrollTrigger: { trigger: el, start: "top 85%" }, delay: i * 0.08,
      });
    });
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <section className="py-12 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-ui text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Cada Passo Rumo à Festa</motion.p>
          <StrokeText text="Do Sim ao Palco" fontSize="12rem" />
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">
            Da assinatura do contrato ao grande dia — acompanhe como transformamos cada detalhe em uma experiência impecável.
          </motion.p>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px">
            <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }} className="w-full h-full timeline-line origin-top" />
          </div>

          {steps.map((step: any, index: number) => {
            const Icon = iconMap[step.icon] || CheckCircle2;
            return (
              <div key={step.title} className="relative flex items-start gap-6 mb-8 last:mb-0">
                <div className="relative z-10 flex-shrink-0" style={{ perspective: "600px" }}>
                  <div ref={(el) => { nodeRefs.current[index] = el; }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center border ${step.active ? "bg-primary/20 border-primary gold-glow" : "bg-secondary border-border"}`}
                    style={{ transformStyle: "preserve-3d" }}>
                    <Icon className={`w-6 h-6 ${step.active ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                </div>
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="pt-2">
                  <p className="font-ui text-xs tracking-[0.2em] uppercase text-primary mb-1">{step.date}</p>
                  <h3 className="font-display text-2xl text-foreground font-light mb-2">{step.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
