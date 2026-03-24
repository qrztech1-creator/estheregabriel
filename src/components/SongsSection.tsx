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
  year: string;
  spotifyUrl: string;
  youtubeUrl: string;
  cover: string;
}

const songs: Song[] = [
  {
    title: "Mr. Brightside",
    artist: "The Killers",
    year: "2003",
    spotifyUrl: "https://open.spotify.com/track/003vvx7Niy0yvhvHt4a68B",
    youtubeUrl: "https://www.youtube.com/watch?v=gGdGFtwCNBE",
    cover: "https://i.scdn.co/image/ab67616d0000b2739c284a6855f4e7665d27a854",
  },
  {
    title: "Do I Wanna Know?",
    artist: "Arctic Monkeys",
    year: "2013",
    spotifyUrl: "https://open.spotify.com/track/5FVd6KXrgO9B3JPmGP2dTg",
    youtubeUrl: "https://www.youtube.com/watch?v=bpOSxM0rNPM",
    cover: "https://i.scdn.co/image/ab67616d0000b273fc3f54ea8ffa6688ab954217",
  },
  {
    title: "Uptown Funk",
    artist: "Bruno Mars",
    year: "2014",
    spotifyUrl: "https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS",
    youtubeUrl: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
    cover: "https://i.scdn.co/image/ab67616d0000b273e419ccba0baa8bd3f3d7abf2",
  },
  {
    title: "Billie Jean",
    artist: "Michael Jackson",
    year: "1982",
    spotifyUrl: "https://open.spotify.com/track/5ChkMS8OtdzJeqyybCc9R5",
    youtubeUrl: "https://www.youtube.com/watch?v=Zi_XLOBDo_Y",
    cover: "https://i.scdn.co/image/ab67616d0000b273de437d960dda1ac0a3f07e9a",
  },
  {
    title: "R U Mine?",
    artist: "Arctic Monkeys",
    year: "2013",
    spotifyUrl: "https://open.spotify.com/track/6wJlxMCERpGdEf3Uyb0M1v",
    youtubeUrl: "https://www.youtube.com/watch?v=ngzC_8zqInk",
    cover: "https://i.scdn.co/image/ab67616d0000b273fc3f54ea8ffa6688ab954217",
  },
  {
    title: "Redenção",
    artist: "Fresno",
    year: "2008",
    spotifyUrl: "https://open.spotify.com/track/1eJLnxJBVMuUBxgVOcSCnp",
    youtubeUrl: "https://www.youtube.com/watch?v=3XxROzhXJlY",
    cover: "https://i.scdn.co/image/ab67616d0000b27359d4a72e3b084cbb15b3de6c",
  },
  {
    title: "Don't Stop Me Now",
    artist: "Queen",
    year: "1978",
    spotifyUrl: "https://open.spotify.com/track/7hQJA50XrCWABAu5v6QZ4i",
    youtubeUrl: "https://www.youtube.com/watch?v=HgzGwKwLmgM",
    cover: "https://i.scdn.co/image/ab67616d0000b273008b06ec71019afd70153889",
  },
  {
    title: "Somebody Told Me",
    artist: "The Killers",
    year: "2004",
    spotifyUrl: "https://open.spotify.com/track/4Bkb8ZUSJQP0VYbGNTfhrI",
    youtubeUrl: "https://www.youtube.com/watch?v=Y5fBPhc1usa",
    cover: "https://i.scdn.co/image/ab67616d0000b2739c284a6855f4e7665d27a854",
  },
  {
    title: "Just The Way You Are",
    artist: "Bruno Mars",
    year: "2010",
    spotifyUrl: "https://open.spotify.com/track/7BqBn9nzAq8spo5e7cZ0dJ",
    youtubeUrl: "https://www.youtube.com/watch?v=LjhCEhWiKXk",
    cover: "https://i.scdn.co/image/ab67616d0000b273f8861bcff39f3f498e9e8393",
  },
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
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
          },
          delay: i * 0.06,
        }
      );
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background 3D music notes */}
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
            Uma Amostra do Repertório
          </motion.p>

          <StrokeText text="A Trilha Sonora" fontSize="8rem" />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-body text-muted-foreground mt-6 max-w-xl mx-auto"
          >
            Hits selecionados para criar a atmosfera perfeita. 
            A playlist completa com 16 blocos temáticos está disponível na área de personalização.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs.map((song, index) => (
            <div
              key={`${song.artist}-${song.title}`}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="glass-surface p-4 rounded-sm group hover:border-primary/40 transition-all duration-500 hover:scale-[1.02]"
              style={{ perspective: "800px", transformStyle: "preserve-3d" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-sm overflow-hidden flex-shrink-0 ring-1 ring-border">
                  <img
                    src={song.cover}
                    alt={`${song.title} - ${song.artist}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    width={64}
                    height={64}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-foreground truncate">{song.title}</p>
                  <p className="font-body text-xs text-muted-foreground">{song.artist} · {song.year}</p>
                  <div className="flex gap-3 mt-2">
                    <a
                      href={song.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-ui text-[10px] tracking-wider uppercase text-primary hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      Spotify <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={song.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-ui text-[10px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      YouTube <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to full playlist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="font-body text-sm text-muted-foreground mb-6">
            Quer ver todas as {">"}100 músicas organizadas em 16 blocos e personalizar o repertório?
          </p>
          <a
            href="/playlist/esther-gabriel-2027"
            className="inline-flex items-center gap-3 px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-sm font-ui text-xs tracking-[0.15em] uppercase group"
          >
            <Music className="w-4 h-4" />
            Personalizar Repertório
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SongsSection;
