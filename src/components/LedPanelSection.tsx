import { motion } from "framer-motion";
import { Monitor, Lightbulb, MessageCircle } from "lucide-react";
import StrokeText from "./StrokeText";

const options = [
  {
    icon: Monitor,
    title: "Painel de LED 3×2",
    description:
      "Tela de LED de alta resolução para exibição de fotos do casal, vídeos, mensagens dos convidados e projeções temáticas durante a festa.",
    details: [
      "Tamanho personalizado conforme o espaço",
      "Exibição de fotos e vídeos do casal",
      "Mensagens em tempo real dos convidados",
      "Conteúdo visual sincronizado com a música",
    ],
  },
  {
    icon: Lightbulb,
    title: "Iluminação de Pista",
    description:
      "Iluminação cênica profissional para a pista de dança com efeitos sincronizados ao ritmo da música, criando a atmosfera perfeita.",
    details: [
      "Moving heads e spots profissionais",
      "Efeitos de cor sincronizados com a música",
      "Iluminação decorativa ambiente",
      "Operador de luz dedicado durante o evento",
    ],
  },
];

const LedPanelSection = () => {
  return (
    <section className="py-12 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-ui text-xs tracking-[0.3em] uppercase text-primary mb-4"
          >
            Opcional · Eleve a Experiência
          </motion.p>

          <StrokeText text="Pista & LED" fontSize="12rem" />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-body text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed"
          >
            Opcionais para transformar a pista de dança em uma experiência visual completa.
            Alinharemos juntos como vocês querem que seja.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {options.map((opt, i) => (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-sm border border-border/40 bg-secondary/20 backdrop-blur-sm p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <opt.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground font-light">
                  {opt.title}
                </h3>
              </div>
              <p className="font-body text-sm text-foreground/70 mb-5 leading-relaxed">
                {opt.description}
              </p>
              <ul className="space-y-3">
                {opt.details.map((d) => (
                  <li key={d} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-[7px]" />
                    <span className="font-body text-sm text-foreground/60 leading-snug">{d}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10 rounded-sm border border-primary/20 bg-primary/5 p-8"
        >
          <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Pista de dança com iluminação + Tela de LED 3×2
          </p>
          <p className="font-display text-4xl md:text-5xl text-foreground font-light mb-6">
            R$ 2.800
          </p>
          <a
            href="https://wa.me/5527999936682?text=Ol%C3%A1!%20Tenho%20interesse%20no%20painel%20de%20LED%20e%20ilumina%C3%A7%C3%A3o%20de%20pista%20para%20nosso%20casamento.%20Podemos%20conversar%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 font-ui text-[10px] tracking-[0.2em] uppercase"
          >
            <MessageCircle className="w-4 h-4" />
            Quero saber mais
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default LedPanelSection;
