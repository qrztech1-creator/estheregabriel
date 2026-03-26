import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Music, ExternalLink } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StrokeText from "./StrokeText";
import FloatingScene from "./FloatingScene";
import { useProposal } from "@/contexts/ProposalContext";

gsap.registerPlugin(ScrollTrigger);

const defaultSongs = [
  { title: "Take on Me", artist: "A-ha", videoId: "djV11Xbc914" },
  { title: "I Don't Want to Miss a Thing", artist: "Aerosmith", videoId: "JkK8g6FMEXE" },
  { title: "Valerie", artist: "Amy Winehouse", videoId: "bixuI_GV5I0" },
  { title: "Do I Wanna Know?", artist: "Arctic Monkeys", videoId: "pqrUQrAcfo4" },
  { title: "Like a Stone", artist: "Audioslave", videoId: "7QU1nvuxaMA" },
  { title: "I Want It That Way", artist: "Backstreet Boys", videoId: "4fndeDfaWCg" },
  { title: "Stayin' Alive", artist: "Bee Gees", videoId: "fNFzfwLM72c" },
  { title: "Stand By Me", artist: "Ben E. King", videoId: "hwZNL7QVJjE" },
  { title: "Livin' on a Prayer", artist: "Bon Jovi", videoId: "lDK9QqIzhwk" },
  { title: "Locked Out of Heaven", artist: "Bruno Mars", videoId: "e-fA-gBCkj0" },
  { title: "Treasure", artist: "Bruno Mars", videoId: "VFmHB5KVe_g" },
  { title: "Uptown Funk", artist: "Bruno Mars", videoId: "OPf0YbXqDm0" },
  { title: "Heaven", artist: "Bryan Adams", videoId: "3eT464L1YRA" },
  { title: "Ela Vai Voltar", artist: "Charlie Brown Jr.", videoId: "PBBmhJkMYWI" },
  { title: "Lutar Pelo Que É Meu", artist: "Charlie Brown Jr.", videoId: "iUaHMOWRjkI" },
  { title: "Pontes Indestrutíveis", artist: "Charlie Brown Jr.", videoId: "T7XAOQ6k8YE" },
  { title: "Zóio de Lula", artist: "Charlie Brown Jr.", videoId: "BhEXEDAja28" },
  { title: "Have You Ever Seen the Rain?", artist: "Creedence", videoId: "u1V8YRJnr4Q" },
  { title: "Get Lucky", artist: "Daft Punk", videoId: "5NV6Rdv1a3I" },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses", videoId: "1w7OgIMMRc4" },
  { title: "As It Was", artist: "Harry Styles", videoId: "H5v3kku4y6Q" },
  { title: "Don't Stop Believin'", artist: "Journey", videoId: "1k8craCGpgs" },
  { title: "Use Somebody", artist: "Kings of Leon", videoId: "gnhXHvRoUd0" },
  { title: "In the End", artist: "Linkin Park", videoId: "eVTXPUF4Oz4" },
  { title: "She Got the Best of Me", artist: "Luke Combs", videoId: "sD3kO4U5Oh4" },
  { title: "Love Never Felt So Good", artist: "Michael Jackson", videoId: "oG08ukJPtR8" },
  { title: "Cedo ou Tarde", artist: "NX Zero", videoId: "XdglM81b4g8" },
  { title: "Razões e Emoções", artist: "NX Zero", videoId: "7KbY8QT0CGI" },
  { title: "Wonderwall", artist: "Oasis", videoId: "6hzrDeceEKc" },
  { title: "Decode", artist: "Paramore", videoId: "RvnkAtWcKYg" },
  { title: "Playing God", artist: "Paramore", videoId: "iDy2wCQYSrU" },
  { title: "Still Into You", artist: "Paramore", videoId: "OblL026SvD4" },
  { title: "That's What You Get", artist: "Paramore", videoId: "1kz6hNDlEEg" },
  { title: "Bless the Broken Road", artist: "Rascal Flatts", videoId: "I_yO3m-WcbY" },
  { title: "Life Is a Highway", artist: "Rascal Flatts", videoId: "5tXh_MfrMe0" },
  { title: "What Hurts the Most", artist: "Rascal Flatts", videoId: "7qH4qyi1-Ys" },
  { title: "Californication", artist: "Red Hot Chili Peppers", videoId: "YlUKcNNmywk" },
  { title: "Everybody Wants to Rule the World", artist: "Tears for Fears", videoId: "aGCdLKXNF3w" },
  { title: "Mr. Brightside", artist: "The Killers", videoId: "j8tZs6G_h7U" },
  { title: "Every Breath You Take", artist: "The Police", videoId: "OMOGaugKpzs" },
  { title: "Reptilia", artist: "The Strokes", videoId: "b8-tXG8KrWs" },
  { title: "I'll Be Over You", artist: "Toto", videoId: "r7XhWUDj-Ts" },
];

const SongsSection = () => {
  const proposal = useProposal();
  const songs = (proposal?.showcase_songs?.length ? proposal.showcase_songs : defaultSongs) as any[];
  const slug = proposal?.slug ?? "esther-gabriel-2027";
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card, { y: 60, opacity: 0, rotationY: -15, scale: 0.9 }, {
        y: 0, opacity: 1, rotationY: 0, scale: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 90%" }, delay: i * 0.03,
      });
    });
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <section className="py-12 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30"><FloatingScene variant="notes" height="100%" /></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-ui text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">A Trilha da Noite Mais Épica</motion.p>
          <StrokeText text="O Som da Festa" fontSize="12rem" />
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">
            Cada música foi escolhida para criar momentos impossíveis de esquecer.
          </motion.p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2">
          {songs.map((song: any, index: number) => (
            <a key={`${song.artist}-${song.title}`} ref={(el) => { cardsRef.current[index] = el; }}
              href={`https://www.youtube.com/watch?v=${song.videoId}`} target="_blank" rel="noopener noreferrer"
              className="glass-surface rounded-sm group hover:border-primary/40 transition-all duration-150 hover:scale-[1.03] hover:shadow-[0_0_20px_hsla(43,59%,52%,0.15)] block overflow-hidden"
              style={{ perspective: "800px", transformStyle: "preserve-3d" }}>
              <div className="relative aspect-video overflow-hidden bg-secondary/30">
                <img src={`https://img.youtube.com/vi/${song.videoId}/hqdefault.jpg`} alt={`${song.title} - ${song.artist}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = "none"; const f = e.currentTarget.nextElementSibling as HTMLElement; if (f) f.style.display = "flex"; }} />
                <div className="w-full h-full items-center justify-center bg-secondary/50" style={{ display: "none" }}><Music className="w-10 h-10 text-primary/40" /></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3"><ExternalLink className="w-4 h-4 text-primary" /></div>
              </div>
              <div className="p-3">
                <p className="font-body text-sm font-medium text-foreground truncate">{song.title}</p>
                <p className="font-body text-xs text-muted-foreground truncate">{song.artist}</p>
              </div>
            </a>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
          <p className="font-body text-sm text-muted-foreground mb-6">
            Essas são apenas algumas. A lista completa com mais de 100 músicas organizadas em 16 blocos temáticos espera por vocês.
          </p>
          <a href={`/playlist/${slug}`} className="inline-flex items-center gap-3 px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 rounded-sm font-ui text-xs tracking-[0.15em] uppercase group hover:shadow-[0_0_25px_hsla(43,59%,52%,0.3)]">
            <Music className="w-4 h-4" />Explorar Repertório Completo<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SongsSection;
