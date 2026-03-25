import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Music, ExternalLink } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StrokeText from "./StrokeText";
import FloatingScene from "./FloatingScene";

gsap.registerPlugin(ScrollTrigger);

interface Song {
  title: string;
  artist: string;
  videoId: string;
}

const songs: Song[] = [
  { title: "Razões e Emoções", artist: "NX Zero", videoId: "K4x1dvxFgHQ" },
  { title: "Cedo ou Tarde", artist: "NX Zero", videoId: "aEEvXp2STKI" },
  { title: "Love Never Felt So Good", artist: "Michael Jackson", videoId: "oG08ukJPtR8" },
  { title: "I Want to Break Free", artist: "Queen", videoId: "f4Mc-NYPHaQ" },
  { title: "We Are the Champions", artist: "Queen", videoId: "04854XqcfCY" },
  { title: "That's What You Get", artist: "Paramore", videoId: "1kz6hN4K-8A" },
  { title: "Playing God", artist: "Paramore", videoId: "oHrq34gMtzY" },
  { title: "Still Into You", artist: "Paramore", videoId: "OblL026SvD4" },
  { title: "Decode", artist: "Paramore", videoId: "RvnkAtWcKYg" },
  { title: "Valerie", artist: "Amy Winehouse", videoId: "dAITHeJQBRo" },
  { title: "Stand By Me", artist: "Ben E. King", videoId: "hwZNL7QVJjE" },
  { title: "Have You Ever Seen the Rain?", artist: "Creedence", videoId: "Gu2pVPWGYMQ" },
  { title: "Everybody Wants to Rule the World", artist: "Tears for Fears", videoId: "aGCdLKXNF3w" },
  { title: "Locked Out of Heaven", artist: "Bruno Mars", videoId: "e-fA-gBCkj0" },
  { title: "Treasure", artist: "Bruno Mars", videoId: "nPvuNsRccVw" },
  { title: "Get Lucky", artist: "Daft Punk", videoId: "5NV6Rdv1a3I" },
  { title: "Stayin' Alive", artist: "Bee Gees", videoId: "I_izvAbhExY" },
  { title: "Wonderwall", artist: "Oasis", videoId: "bx1Bh8ZvH84" },
  { title: "I Want It That Way", artist: "Backstreet Boys", videoId: "4fndeDfaWCg" },
  { title: "Like a Stone", artist: "Audioslave", videoId: "7QU1nvuxaMA" },
  { title: "Use Somebody", artist: "Kings of Leon", videoId: "gnhXHvRoUd0" },
  { title: "Heaven", artist: "Bryan Adams", videoId: "s6TtwR2Dbjg" },
  { title: "Every Breath You Take", artist: "The Police", videoId: "OMOGaugKpzs" },
  { title: "In the End", artist: "Linkin Park", videoId: "eVTXPUF4Oz4" },
  { title: "Don't Stop Believin'", artist: "Journey", videoId: "1k8craCGpgs" },
  { title: "I'll Be Over You", artist: "Toto", videoId: "4gMgiXfqyzZLMhsksGmbQV" },
  { title: "Californication", artist: "Red Hot Chili Peppers", videoId: "YlUKcNNmywk" },
  { title: "I Don't Want to Miss a Thing", artist: "Aerosmith", videoId: "JkK8g6FMEXE" },
  { title: "Take on Me", artist: "A-ha", videoId: "djV11Xbc914" },
  { title: "As It Was", artist: "Harry Styles", videoId: "H5v3kku4y6Q" },
  { title: "Reptilia", artist: "The Strokes", videoId: "b8-tXG8KyWs" },
  { title: "Mr. Brightside", artist: "The Killers", videoId: "gGdGFtwCNBE" },
  { title: "Do I Wanna Know?", artist: "Arctic Monkeys", videoId: "bpOSxM0rNPM" },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses", videoId: "1w7OgIMMRc4" },
  { title: "Uptown Funk", artist: "Bruno Mars", videoId: "OPf0YbXqDm0" },
  { title: "Don't Stop Me Now", artist: "Queen", videoId: "HgzGwKwLmgM" },
  { title: "Livin' on a Prayer", artist: "Bon Jovi", videoId: "lDK9QqIzhwk" },
];

const SongsSection = () => {
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

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
          delay: i * 0.03,
        }
      );
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <section className="py-12 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <FloatingScene variant="notes" height="100%" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-ui text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4"
          >
            A Trilha da Noite Mais Épica
          </motion.p>

          <StrokeText text="O Som da Festa" fontSize="10rem" />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-body text-muted-foreground mt-4 max-w-xl mx-auto"
          >
            Cada música foi escolhida para criar momentos impossíveis de esquecer.
            De clássicos imortais a hits que vão fazer todo mundo cantar junto.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {songs.map((song, index) => (
            <a
              key={`${song.artist}-${song.title}`}
              ref={(el) => { cardsRef.current[index] = el; }}
              href={`https://www.youtube.com/watch?v=${song.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-surface rounded-sm group hover:border-primary/40 transition-all duration-150 hover:scale-[1.03] hover:shadow-[0_0_20px_hsla(43,59%,52%,0.15)] block overflow-hidden"
              style={{ perspective: "800px", transformStyle: "preserve-3d" }}
            >
              <div className="relative aspect-video overflow-hidden bg-secondary/30">
                <img
                  src={`https://img.youtube.com/vi/${song.videoId}/hqdefault.jpg`}
                  alt={`${song.title} - ${song.artist}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div className="w-full h-full items-center justify-center bg-secondary/50" style={{ display: "none" }}>
                  <Music className="w-10 h-10 text-primary/40" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                  <ExternalLink className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="p-3">
                <p className="font-body text-sm font-medium text-foreground truncate">{song.title}</p>
                <p className="font-body text-xs text-muted-foreground truncate">{song.artist}</p>
              </div>
            </a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="font-body text-sm text-muted-foreground mb-6">
            Essas são apenas algumas. A lista completa com mais de 100 músicas organizadas em 16 blocos temáticos espera por vocês.
          </p>
          <a
            href="/playlist/esther-gabriel-2027"
            className="inline-flex items-center gap-3 px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 rounded-sm font-ui text-xs tracking-[0.15em] uppercase group hover:shadow-[0_0_25px_hsla(43,59%,52%,0.3)]"
          >
            <Music className="w-4 h-4" />
            Explorar Repertório Completo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SongsSection;
