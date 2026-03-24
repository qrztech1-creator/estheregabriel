import { motion } from "framer-motion";
import { CalendarDays, ListMusic, Users, Mic2, PartyPopper, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: CheckCircle2,
    title: "Fechamento do Contrato",
    date: "Março 2026",
    description: "Assinatura e entrada. Definição das preferências iniciais de repertório.",
    active: true,
  },
  {
    icon: ListMusic,
    title: "Definição de Repertório",
    date: "Abril — Junho 2026",
    description: "Noivos montam a playlist do DJ e sugerem músicas para a banda. Trocas e refinamentos.",
  },
  {
    icon: Users,
    title: "Reunião de Alinhamento",
    date: "Setembro 2026",
    description: "Encontro para alinhar detalhes finais: setlist, ordem das músicas, momentos especiais.",
  },
  {
    icon: Mic2,
    title: "Ensaio & Preparação",
    date: "Fevereiro 2027",
    description: "Banda ensaia o repertório final. Ajustes de última hora no setlist.",
  },
  {
    icon: CalendarDays,
    title: "Passagem de Som",
    date: "13/03/2027 — Manhã",
    description: "Montagem da estrutura, passagem de som e teste de iluminação no local.",
  },
  {
    icon: PartyPopper,
    title: "O Grande Dia",
    date: "13/03/2027 — 18:00",
    description: "Tudo pronto. A noite perfeita começa. Hora de celebrar!",
  },
];

const ProcessTimeline = () => {
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="font-ui text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            O Processo
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-gold-gradient">
            Da Ideia ao Palco
          </h2>
          <p className="font-body text-muted-foreground mt-6 max-w-xl mx-auto">
            Veja como funciona o processo de organização musical do seu evento, do contrato ao grande dia.
          </p>
        </motion.div>

        <div className="relative">
          {/* Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
              className="w-full h-full timeline-line origin-top"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative flex items-start gap-6 mb-12 last:mb-0"
            >
              {/* Node */}
              <div className="relative z-10 flex-shrink-0">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border ${
                  step.active
                    ? "bg-primary/20 border-primary gold-glow"
                    : "bg-secondary border-border"
                }`}>
                  <step.icon className={`w-6 h-6 ${step.active ? "text-primary" : "text-muted-foreground"}`} />
                </div>
              </div>

              {/* Content */}
              <div className="pt-2">
                <p className="font-ui text-xs tracking-[0.2em] uppercase text-primary mb-1">{step.date}</p>
                <h3 className="font-display text-2xl text-foreground font-light mb-2">{step.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
