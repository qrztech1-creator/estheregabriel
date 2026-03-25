import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Music, Radio, Disc3 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StrokeText from "./StrokeText";
import FloatingScene from "./FloatingScene";
import AnimatedBorderCard from "./AnimatedBorderCard";

gsap.registerPlugin(ScrollTrigger);

const timelineItems = [
  {
    time: "18:00",
    duration: "30 min",
    title: "DJ Abre a Noite",
    description: "A energia começa antes do primeiro brinde. Sons escolhidos a dedo por vocês criam o clima perfeito enquanto os convidados chegam.",
    icon: Radio,
    details: ["Playlist personalizada pelos noivos", "Ambiente lounge que já dá vontade de dançar", "Transição cinematográfica para a banda"],
  },
  {
    time: "18:30",
    duration: "2 horas",
    title: "Banda ao Vivo — O Ápice",
    description: "16 blocos musicais. Do rock alternativo ao pop, do nacional ao internacional. Cada nota pensada para manter a pista lotada e a energia sempre subindo.",
    icon: Music,
    details: ["The Killers, Arctic Monkeys, Paramore, NX Zero", "Bruno Mars, Michael Jackson, Queen", "Medleys explosivos e blocos temáticos"],
  },
  {
    time: "20:30",
    duration: "1h30",
    title: "DJ Fecha com Tudo",
    description: "A energia não para. O DJ assume com a playlist definitiva — montada por vocês — para fechar uma noite que ninguém vai esquecer.",
    icon: Disc3,
    details: ["Playlist montada pelo casal", "Hits que fazem todo mundo cantar junto", "Energia máxima até o último segundo"],
  },
];

const TimelineSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  useEffect(() => {
    iconRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { rotationY: -180, scale: 0.3, opacity: 0 },
        {
          rotationY: 0,
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "back.out(2)",
          scrollTrigger: { trigger: el, start: "top 85%" },
          delay: i * 0.15,
        }
      );
    });

    // Repeating title glow every 15s
    titleRefs.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        textShadow: "0 0 25px hsla(43, 59%, 52%, 0.4)",
        duration: 1,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        repeatDelay: 14,
        delay: 5,
      });
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <section ref={sectionRef} className="py-28 px-6 relative">
      <div className="absolute inset-0 opacity-40">
        <FloatingScene variant="waveform" height="100%" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-ui text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4"
          >
            4 Horas de Música Imersiva
          </motion.p>

          <StrokeText text="A Noite É Sua" fontSize="8rem" />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-body text-muted-foreground mt-6 max-w-xl mx-auto"
          >
            Cada minuto orquestrado para criar a festa que vocês sempre sonharam — do primeiro acorde ao último drop.
          </motion.p>
        </div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
              className="w-full h-full timeline-line origin-top"
            />
          </div>

          {timelineItems.map((item, index) => (
            <div
              key={item.title}
              className={`relative flex items-start gap-8 mb-20 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                <div
                  ref={(el) => { iconRefs.current[index] = el; }}
                  className="w-16 h-16 rounded-full bg-background border border-primary flex items-center justify-center gold-glow"
                  style={{ perspective: "600px", transformStyle: "preserve-3d" }}
                >
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className={`ml-24 md:ml-0 md:w-[calc(50%-4rem)] ${index % 2 === 0 ? "md:pr-16" : "md:pl-16"}`}>
                <AnimatedBorderCard delay={index * 0.2}>
                  <div className="p-8">
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="font-ui text-2xl font-bold text-primary tabular-nums">{item.time}</span>
                      <span className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground">{item.duration}</span>
                    </div>
                    <h3
                      ref={(el) => { titleRefs.current[index] = el; }}
                      className="font-display text-3xl font-light text-foreground mb-3"
                    >
                      {item.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                    <ul className="space-y-2">
                      {item.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedBorderCard>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
