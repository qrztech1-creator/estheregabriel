import { motion } from "framer-motion";
import { Check, Music, Disc3, Lightbulb, Volume2 } from "lucide-react";

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
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-ui text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Investimento
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-gold-gradient">
            Sua Noite Perfeita
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-surface p-8 md:p-12 rounded-sm"
        >
          {/* What's included */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {included.map((item) => (
              <div key={item.text} className="flex items-start gap-3 p-4 rounded-sm bg-secondary/30">
                <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="font-body text-sm text-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Tech details */}
          <div className="mb-10">
            <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Estrutura técnica inclusa
            </p>
            <div className="flex flex-wrap gap-2">
              {techDetails.map((detail) => (
                <span
                  key={detail}
                  className="font-body text-xs px-3 py-1.5 rounded-sm bg-secondary/50 text-muted-foreground"
                >
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
              <p className="font-display text-5xl md:text-7xl font-light text-gold-gradient">
                R$ 8.850
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-sm gold-border-glow text-center hover:gold-glow transition-all duration-500">
                <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                  Entrada de 30%
                </p>
                <p className="font-display text-3xl text-foreground font-light">R$ 8.374<span className="text-lg">,75</span></p>
                <p className="font-body text-xs text-primary mt-2">Economia de R$ 475,25</p>
              </div>
              <div className="p-6 rounded-sm gold-border-glow text-center hover:gold-glow transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary px-3 py-1">
                  <p className="font-ui text-[10px] tracking-wider uppercase text-primary-foreground">Melhor valor</p>
                </div>
                <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                  Entrada de 50%
                </p>
                <p className="font-display text-3xl text-foreground font-light">R$ 7.865</p>
                <p className="font-body text-xs text-primary mt-2">Economia de R$ 985,00</p>
              </div>
            </div>

            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block"
              >
                <a
                  href="https://wa.me/5527999936682"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500 breathing-glow font-ui text-sm tracking-[0.15em] uppercase"
                >
                  Aceitar Proposta
                </a>
              </motion.div>
              <p className="font-body text-xs text-muted-foreground mt-4">
                Condições especiais válidas para fechamento em até 48h
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
