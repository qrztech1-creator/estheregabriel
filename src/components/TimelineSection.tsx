import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Music, Radio, Disc3 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const timelineItems = [
  {
    time: "18:00",
    duration: "30 min",
    title: "DJ Receptivo",
    description: "Playlist curada por vocês. Sons que criam atmosfera antes mesmo do primeiro brinde.",
    icon: Radio,
    details: ["Playlist personalizada pelos noivos", "Ambiente lounge sofisticado", "Transição suave para a banda"],
  },
  {
    time: "18:30",
    duration: "2 horas",
    title: "Banda ao Vivo",
    description: "16 blocos musicais. Do rock alternativo ao pop, do nacional ao internacional. Cada nota pensada para manter a energia em ascensão.",
    icon: Music,
    details: ["The Killers, Arctic Monkeys, Bruno Mars", "Michael Jackson, Fresno e mais", "Medleys e blocos temáticos"],
  },
  {
    time: "20:30",
    duration: "1h30",
    title: "DJ Fecha a Noite",
    description: "A energia não para. O DJ assume com a playlist definitiva — montada por vocês — para fechar uma noite que ninguém vai esquecer.",
    icon: Disc3,
    details: ["Playlist montada pelo casal", "Hits dos anos 2000", "Energia máxima até o fim"],
  },
];

const TimelineSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-ui text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4"
          >
            Arquitetura Sonora
          </motion.p>
          <h2
            ref={headingRef}
            className="font-display text-4xl md:text-6xl lg:text-8xl font-light text-gold-gradient"
          >
            Uma Noite Orquestrada
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-body text-muted-foreground mt-6 max-w-xl mx-auto"
          >
            Quatro horas desenhadas para elevar cada momento — da chegada ao último acorde.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Central line */}
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
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative flex items-start gap-8 mb-20 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Node */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  whileInView={{ scale: [0.5, 1.2, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  className="w-16 h-16 rounded-full bg-background border border-primary flex items-center justify-center gold-glow"
                >
                  <item.icon className="w-6 h-6 text-primary" />
                </motion.div>
              </div>

              {/* Content */}
              <div className={`ml-24 md:ml-0 md:w-[calc(50%-4rem)] ${index % 2 === 0 ? "md:pr-16" : "md:pl-16"}`}>
                <div className="glass-surface p-8 rounded-sm hover:border-primary/40 transition-all duration-500 group">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="font-ui text-2xl font-bold text-primary tabular-nums">{item.time}</span>
                    <span className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground">{item.duration}</span>
                  </div>
                  <h3 className="font-display text-3xl font-light text-foreground mb-3">{item.title}</h3>
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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
