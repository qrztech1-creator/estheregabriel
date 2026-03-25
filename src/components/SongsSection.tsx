import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, Music } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StrokeText from "./StrokeText";
import FloatingScene from "./FloatingScene";

gsap.registerPlugin(ScrollTrigger);

interface Song {
  title: string;
  artist: string;
  spotifyUrl: string;
  youtubeUrl: string;
}

const songs: Song[] = [
  { title: "Mr. Brightside", artist: "The Killers", spotifyUrl: "https://open.spotify.com/track/003vvx7Niy0yvhvHt4a68B", youtubeUrl: "https://www.youtube.com/watch?v=gGdGFtwCNBE" },
  { title: "Do I Wanna Know?", artist: "Arctic Monkeys", spotifyUrl: "https://open.spotify.com/track/5FVd6KXrgO9B3JPmGP2dTg", youtubeUrl: "https://www.youtube.com/watch?v=bpOSxM0rNPM" },
  { title: "Uptown Funk", artist: "Bruno Mars", spotifyUrl: "https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS", youtubeUrl: "https://www.youtube.com/watch?v=OPf0YbXqDm0" },
  { title: "Billie Jean", artist: "Michael Jackson", spotifyUrl: "https://open.spotify.com/track/5ChkMS8OtdzJeqyybCc9R5", youtubeUrl: "https://www.youtube.com/watch?v=Zi_XLOBDo_Y" },
  { title: "Decode", artist: "Paramore", spotifyUrl: "https://open.spotify.com/track/2wVkLJGDsUlXcg1VPbpMIy", youtubeUrl: "https://www.youtube.com/watch?v=RvnkAtWcKYg" },
  { title: "Cedo ou Tarde", artist: "NX Zero", spotifyUrl: "https://open.spotify.com/track/5x2tCqIPg4lMuKCFrHsaXq", youtubeUrl: "https://www.youtube.com/watch?v=dOxMnVFt9ek" },
  { title: "Redenção", artist: "Fresno", spotifyUrl: "https://open.spotify.com/track/1eJLnxJBVMuUBxgVOcSCnp", youtubeUrl: "https://www.youtube.com/watch?v=3XxROzhXJlY" },
  { title: "Don't Stop Me Now", artist: "Queen", spotifyUrl: "https://open.spotify.com/track/7hQJA50XrCWABAu5v6QZ4i", youtubeUrl: "https://www.youtube.com/watch?v=HgzGwKwLmgM" },
  { title: "Just The Way You Are", artist: "Bruno Mars", spotifyUrl: "https://open.spotify.com/track/7BqBn9nzAq8spo5e7cZ0dJ", youtubeUrl: "https://www.youtube.com/watch?v=LjhCEhWiKXk" },
  { title: "Under Pressure", artist: "Queen & David Bowie", spotifyUrl: "https://open.spotify.com/track/2fuCquhmrzHpu5xcA1ci9x", youtubeUrl: "https://www.youtube.com/watch?v=a01QQZyl-_I" },
  { title: "Livin' on a Prayer", artist: "Bon Jovi", spotifyUrl: "https://open.spotify.com/track/37ZJ0p5Jm13WALsjMAkpl2", youtubeUrl: "https://www.youtube.com/watch?v=lDK9QqIzhwk" },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses", spotifyUrl: "https://open.spotify.com/track/7o2CTH4ctstm8TNelqjb51", youtubeUrl: "https://www.youtube.com/watch?v=1w7OgIMMRc4" },
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
          delay: i * 0.06,
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
            Hits Que Vão Fazer a Pista Explodir
          </motion.p>

          <StrokeText text="O Som da Festa" fontSize="8rem" />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-body text-muted-foreground mt-6 max-w-xl mx-auto"
          >
            De clássicos do rock a hits do pop — cada música escolhida para transformar sua noite em algo inesquecível. 
            A playlist completa com 16 blocos temáticos espera por vocês.
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
                {/* Music icon instead of broken cover images */}
                <div className="w-14 h-14 rounded-sm flex-shrink-0 bg-secondary/50 flex items-center justify-center ring-1 ring-border group-hover:ring-primary/40 transition-colors duration-150">
                  <Music className="w-6 h-6 text-primary/60 group-hover:text-primary transition-colors duration-150" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-foreground truncate">{song.title}</p>
                  <p className="font-body text-xs text-muted-foreground">{song.artist}</p>
                  <div className="flex gap-3 mt-2">
                    <a
                      href={song.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-ui text-[10px] tracking-wider uppercase text-primary hover:text-foreground transition-colors duration-150 flex items-center gap-1"
                    >
                      Spotify <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={song.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-ui text-[10px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors duration-150 flex items-center gap-1"
                    >
                      YouTube <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
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
            Quer ver todas as {">"}100 músicas organizadas em 16 blocos e montar a festa do seu jeito?
          </p>
          <a
            href="/playlist/esther-gabriel-2027"
            className="inline-flex items-center gap-3 px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 rounded-sm font-ui text-xs tracking-[0.15em] uppercase group"
          >
            <Music className="w-4 h-4" />
            Montar Minha Playlist
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SongsSection;
