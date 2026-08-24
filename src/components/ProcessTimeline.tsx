import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ListMusic, Users, Mic2, PartyPopper, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StrokeText from "./StrokeText";
import { useProposal } from "@/contexts/ProposalContext";
import { getSectionCopy } from "@/data/templates";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, any> = { CalendarDays, ListMusic, Users, Mic2, PartyPopper, CheckCircle2 };

const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function computeDynamicDates(eventDate: string, proposalDeadline: string | null) {
  const event = new Date(eventDate + "T12:00:00");
  const eventMonth = event.getMonth();
  const eventYear = event.getFullYear();
  const eventDay = event.getDate();

  // Deadline month (or 6 months before event as fallback)
  let deadlineDate: Date;
  if (proposalDeadline) {
    deadlineDate = new Date(proposalDeadline);
  } else {
    deadlineDate = new Date(eventYear, eventMonth - 6, 1);
  }
  const dlMonth = deadlineDate.getMonth();
  const dlYear = deadlineDate.getFullYear();

  // Month 2-4 after deadline
  const m2 = new Date(dlYear, dlMonth + 1, 1);
  const m4 = new Date(dlYear, dlMonth + 3, 1);

  // Month 6 after deadline
  const m6 = new Date(dlYear, dlMonth + 5, 1);

  // Month before event
  const prevMonth = new Date(eventYear, eventMonth - 1, 1);

  const fmt = (d: Date) => `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
  const fmtRange = (a: Date, b: Date) => {
    if (a.getFullYear() === b.getFullYear()) return `${monthNames[a.getMonth()]} — ${monthNames[b.getMonth()]} ${a.getFullYear()}`;
    return `${fmt(a)} — ${fmt(b)}`;
  };
  const fmtDay = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

  return [
    { icon: "CheckCircle2", title: "Fechamento do Contrato", date: fmt(deadlineDate), description: "Assinatura e entrada. Definição das preferências iniciais de repertório.", active: true },
    { icon: "ListMusic", title: "Definição de Repertório", date: fmtRange(m2, m4), description: "Vocês montam a playlist do DJ e sugerem músicas para a banda. Troca de ideias e refinamentos." },
    { icon: "Users", title: "Reunião de Alinhamento", date: fmt(m6), description: "Encontro para alinhar detalhes finais: setlist, ordem das músicas, definição de momentos especiais." },
    { icon: "Mic2", title: "Ensaio & Preparação", date: fmt(prevMonth), description: "Banda ensaia o repertório final. Ajustes de última hora no setlist." },
    { icon: "CalendarDays", title: "Passagem de Som", date: `${fmtDay(event)} — Manhã`, description: "Montagem da estrutura, passagem de som e teste de iluminação no local." },
    { icon: "PartyPopper", title: "O Grande Dia", date: fmtDay(event), description: "Tudo pronto conforme o sonho de vocês. A noite perfeita começa. Hora de celebrar!" },
  ];
}

const ProcessTimeline = () => {
  const proposal = useProposal();
  const copy = getSectionCopy(proposal, "process");

  // Use saved steps if they have real dates, otherwise compute dynamically
  let steps: any[];
  if (proposal?.process_steps?.length) {
    const saved = proposal.process_steps as any[];
    // Check if steps have generic "Mês 1" style dates — if so, compute dynamic
    const hasGenericDates = saved.some((s: any) => /^Mês\s/i.test(s.date || ""));
    if (hasGenericDates && proposal.event_date) {
      steps = computeDynamicDates(proposal.event_date, proposal.proposal_deadline);
    } else {
      steps = saved;
    }
  } else if (proposal?.event_date) {
    steps = computeDynamicDates(proposal.event_date, proposal.proposal_deadline);
  } else {
    steps = computeDynamicDates("2027-03-13", null);
  }

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
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-ui text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">{copy.eyebrow}</motion.p>
          <StrokeText text={copy.title} fontSize="12rem" />
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">
            {copy.subtitle}
          </motion.p>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px">
            <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }} className="w-full h-full timeline-line origin-top" />
          </div>

          {steps.map((step: any, index: number) => {
            const Icon = iconMap[step.icon] || CheckCircle2;
            return (
              <div key={index} className="relative flex items-start gap-6 mb-8 last:mb-0">
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
