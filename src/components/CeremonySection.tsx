import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ceremonyViolin from "@/assets/ceremony-violin.jpg";
import ceremonyPiano from "@/assets/ceremony-piano.jpg";
import ceremonyVocal from "@/assets/ceremony-vocal.jpg";
import ceremonyGuitar from "@/assets/ceremony-guitar.jpg";
import capaYoutube from "@/assets/capa-youtube.png";
import StrokeText from "./StrokeText";
import FloatingScene from "./FloatingScene";

gsap.registerPlugin(ScrollTrigger);

const instruments = [
  { name: "Piano", image: ceremonyPiano },
  { name: "Violino", image: ceremonyViolin },
  { name: "Vocal", image: ceremonyVocal },
  { name: "Violão", image: ceremonyGuitar },
];

const CeremonySection = () => {
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    imgRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { y: 80, opacity: 0, rotationY: 25, scale: 0.85 },
        {
          y: 0, opacity: 1, rotationY: 0, scale: 1,
          duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          delay: i * 0.12,
        }
      );
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <section className="py-12 px-6 relative overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(0 0% 3.1%), hsl(30 10% 6%), hsl(0 0% 3.1%))" }}>
      <div className="absolute inset-0 opacity-30">
        <FloatingScene variant="diamonds" height="100%" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-ui text-xs tracking-[0.3em] uppercase text-primary mb-4"
          >
            Opcional · Condição Especial
          </motion.p>

          <StrokeText text="A Cerimônia" fontSize="11rem" />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-body text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed"
          >
            A cerimônia é um momento único e merece atenção especial. Para alinhar cada detalhe —
            repertório, entrada da noiva, cortejo e saída — será necessário uma reunião exclusiva
            para entender exatamente como vocês desejam que tudo aconteça.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="font-body text-sm text-primary/80 mt-3 max-w-xl mx-auto"
          >
            ⚠️ Esta é apenas uma citação — o orçamento será feito sob medida após a reunião.
            Os descontos de 30% e 50% continuam vigentes caso fechem o pacote da festa.
          </motion.p>
        </div>

        {/* YouTube Cover - full width, preserving aspect ratio */}
        <div ref={heroImgRef} className="relative rounded-sm overflow-hidden mb-10 gold-border-glow">
          <img
            src={capaYoutube}
            alt="A trilha sonora que vocês merecem, do primeiro ao último acorde"
            className="w-full h-auto object-contain"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
            <p className="font-display text-xl md:text-3xl lg:text-4xl text-foreground font-light">
              "A trilha sonora que vocês merecem,<br />
              <span className="text-gold-gradient">do primeiro ao último acorde."</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {instruments.map((item, index) => (
            <div
              key={item.name}
              ref={(el) => { imgRefs.current[index] = el; }}
              className="group relative rounded-sm overflow-hidden aspect-[3/4] gold-border-glow"
              style={{ perspective: "800px", transformStyle: "preserve-3d" }}
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
            </div>
          ))}
        </div>

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
