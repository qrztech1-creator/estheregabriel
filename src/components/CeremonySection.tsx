import { motion } from "framer-motion";
import ceremonyViolin from "@/assets/ceremony-violin.jpg";
import ceremonyPiano from "@/assets/ceremony-piano.jpg";
import ceremonyCouple from "@/assets/ceremony-couple.jpg";
import ceremonyVocal from "@/assets/ceremony-vocal.jpg";
import ceremonyGuitar from "@/assets/ceremony-guitar.jpg";

const instruments = [
  { name: "Piano", image: ceremonyPiano },
  { name: "Violino", image: ceremonyViolin },
  { name: "Vocal", image: ceremonyVocal },
  { name: "Violão", image: ceremonyGuitar },
];

const CeremonySection = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(0 0% 3.1%), hsl(30 10% 6%), hsl(0 0% 3.1%))" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-ui text-xs tracking-[0.3em] uppercase text-primary mb-4">
            Opcional · Condição Especial
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-gold-gradient">
            A Cerimônia
          </h2>
          <p className="font-body text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
            Ao fechar o pacote completo — cerimônia + festa — garantimos condições ainda melhores. 
            Transforme cada momento do seu casamento em uma experiência musical impecável, do altar à pista.
          </p>
        </motion.div>

        {/* Hero ceremony image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative rounded-sm overflow-hidden mb-16 gold-border-glow"
        >
          <img
            src={ceremonyCouple}
            alt="Casal apreciando música ao vivo no casamento"
            className="w-full h-[50vh] object-cover"
            loading="lazy"
            width={1200}
            height={800}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="font-display text-2xl md:text-4xl text-foreground font-light">
              "A trilha sonora que vocês merecem,<br />
              <span className="text-gold-gradient">do primeiro ao último acorde."</span>
            </p>
          </div>
        </motion.div>

        {/* Instruments grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {instruments.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative rounded-sm overflow-hidden aspect-[3/4] gold-border-glow"
            >
              <img
                src={item.image}
                alt={`${item.name} em casamento`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
                width={400}
                height={533}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="font-ui text-xs tracking-[0.2em] uppercase text-primary">{item.name}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-surface p-8 md:p-12 rounded-sm"
        >
          <h3 className="font-display text-3xl text-foreground font-light mb-6">
            O que oferecemos na cerimônia
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Piano acústico ou teclado premium",
              "Violino solo ou duo",
              "Violão clássico / Baixo acústico",
              "Vocal com microfone condensador",
              "Repertório personalizado para cada momento",
              "Entrada da noiva, cortejo, saída",
              "Equipamento de som dedicado para cerimônia",
              "Profissionais experientes e elegantes",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <p className="font-body text-sm text-muted-foreground">{feature}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-border">
            <p className="font-body text-sm text-primary">
              ✨ Fechando cerimônia + festa, aplicamos os mesmos descontos especiais em ambos os serviços.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CeremonySection;
