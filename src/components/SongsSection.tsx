import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Music } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StrokeText from "./StrokeText";
import FloatingScene from "./FloatingScene";

gsap.registerPlugin(ScrollTrigger);

interface Song {
  title: string;
  artist: string;
}

const songs: Song[] = [
  // User-specified songs first
  { title: "Razões e Emoções", artist: "NX Zero" },
  { title: "Cedo ou Tarde", artist: "NX Zero" },
  { title: "Love Never Felt So Good", artist: "Michael Jackson" },
  { title: "I Want to Break Free", artist: "Queen" },
  { title: "We Are the Champions", artist: "Queen" },
  { title: "That's What You Get", artist: "Paramore" },
  { title: "Playing God", artist: "Paramore" },
  { title: "Still Into You", artist: "Paramore" },
  { title: "Decode", artist: "Paramore" },
  { title: "Valerie", artist: "Amy Winehouse" },
  { title: "Stand By Me", artist: "Ben E. King" },
  { title: "Have You Ever Seen the Rain?", artist: "Creedence Clearwater Revival" },
  { title: "Everybody Wants to Rule the World", artist: "Tears for Fears" },
  { title: "Locked Out of Heaven", artist: "Bruno Mars" },
  { title: "Treasure", artist: "Bruno Mars" },
  { title: "Get Lucky", artist: "Daft Punk" },
  { title: "Stayin' Alive", artist: "Bee Gees" },
  { title: "Wonderwall", artist: "Oasis" },
  { title: "I Want It That Way", artist: "Backstreet Boys" },
  { title: "Like a Stone", artist: "Audioslave" },
  { title: "Use Somebody", artist: "Kings of Leon" },
  { title: "Heaven", artist: "Bryan Adams" },
  { title: "Every Breath You Take", artist: "Sting" },
  { title: "In the End", artist: "Linkin Park" },
  { title: "Don't Stop Believin'", artist: "Journey" },
  { title: "I'll Be Over You", artist: "Toto" },
  { title: "Californication", artist: "Red Hot Chili Peppers" },
  { title: "I Don't Want to Miss a Thing", artist: "Aerosmith" },
  { title: "Take on Me", artist: "A-ha" },
  { title: "As It Was", artist: "Harry Styles" },
  { title: "Reptilia", artist: "The Strokes" },
  { title: "Mr. Brightside", artist: "The Killers" },
  { title: "Do I Wanna Know?", artist: "Arctic Monkeys" },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses" },
  // Previous songs not in the user list
  { title: "Uptown Funk", artist: "Bruno Mars" },
  { title: "Billie Jean", artist: "Michael Jackson" },
  { title: "Redenção", artist: "Fresno" },
  { title: "Don't Stop Me Now", artist: "Queen" },
  { title: "Just The Way You Are", artist: "Bruno Mars" },
  { title: "Under Pressure", artist: "Queen & David Bowie" },
  { title: "Livin' on a Prayer", artist: "Bon Jovi" },
];

const SongsSection = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { y: 60, opacity: 0, rotationY: -15, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 90%" },
          delay: i * 0.04,
        }
      );
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <FloatingScene variant="notes" height="100%" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-ui text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4"
          >
            A Trilha da Noite Mais Épica
          </motion.p>

          <StrokeText text="O Som da Festa" fontSize="8rem" />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-body text-muted-foreground mt-6 max-w-xl mx-auto"
          >
            Cada música foi escolhida para criar momentos impossíveis de esquecer.
            De clássicos imortais a hits que vão fazer todo mundo cantar junto.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs.map((song, index) => (
            <div
              key={`${song.artist}-${song.title}`}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="glass-surface p-4 rounded-sm group hover:border-primary/40 transition-all duration-150 hover:scale-[1.02]"
              style={{ perspective: "800px", transformStyle: "preserve-3d" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-sm flex-shrink-0 bg-secondary/50 flex items-center justify-center ring-1 ring-border group-hover:ring-primary/40 transition-colors duration-150">
                  <Music className="w-6 h-6 text-primary/60 group-hover:text-primary transition-colors duration-150" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-foreground truncate">{song.title}</p>
                  <p className="font-body text-xs text-muted-foreground">{song.artist}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="font-body text-sm text-muted-foreground mb-6">
            Essas são apenas algumas. A lista completa com {">"}100 músicas organizadas em 16 blocos temáticos espera por vocês.
          </p>
          <a
            href="/playlist/esther-gabriel-2027"
            className="inline-flex items-center gap-3 px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 rounded-sm font-ui text-xs tracking-[0.15em] uppercase group"
          >
            <Music className="w-4 h-4" />
            Acessar Playlist Completa
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SongsSection;
