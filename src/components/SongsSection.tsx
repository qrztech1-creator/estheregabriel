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
  image: string;
  link: string;
}

const songs: Song[] = [
  { title: "Razões e Emoções", artist: "NX Zero", image: "https://i.scdn.co/image/ab6761610000e5eb5d3c4bd4d4e28a8f1f0a3b0a", link: "https://open.spotify.com/track/2LNwexVHpVJhW8bJJiHjjP" },
  { title: "Cedo ou Tarde", artist: "NX Zero", image: "https://i.scdn.co/image/ab6761610000e5eb5d3c4bd4d4e28a8f1f0a3b0a", link: "https://open.spotify.com/track/3TsLnXjgBxcyPm0ZgMfMJx" },
  { title: "Love Never Felt So Good", artist: "Michael Jackson", image: "https://i.scdn.co/image/ab6761610000e5eba2a0b9e3448c1e702de9dc06", link: "https://open.spotify.com/track/1kkAMeBUfrJCHxSaX3mIyM" },
  { title: "I Want to Break Free", artist: "Queen", image: "https://i.scdn.co/image/ab6761610000e5eb0b63ee0d5e9a3b48c4d7b3a2", link: "https://open.spotify.com/track/3YOLM2i0VuCCfRMjY0MYiU" },
  { title: "We Are the Champions", artist: "Queen", image: "https://i.scdn.co/image/ab6761610000e5eb0b63ee0d5e9a3b48c4d7b3a2", link: "https://open.spotify.com/track/7ccI9cSCnHMBjCo709fFaL" },
  { title: "That's What You Get", artist: "Paramore", image: "https://i.scdn.co/image/ab6761610000e5ebd8e1ccc3de81a979bd25bfa5", link: "https://open.spotify.com/track/41pFYu7fBcJtdK9moGGaer" },
  { title: "Playing God", artist: "Paramore", image: "https://i.scdn.co/image/ab6761610000e5ebd8e1ccc3de81a979bd25bfa5", link: "https://open.spotify.com/track/5CPKJKIPj0VXlBjCO3xrLh" },
  { title: "Still Into You", artist: "Paramore", image: "https://i.scdn.co/image/ab6761610000e5ebd8e1ccc3de81a979bd25bfa5", link: "https://open.spotify.com/track/1x5sYe4P8aJoBBCJX8sMAg" },
  { title: "Decode", artist: "Paramore", image: "https://i.scdn.co/image/ab6761610000e5ebd8e1ccc3de81a979bd25bfa5", link: "https://open.spotify.com/track/6nek1Nin9q48AVZcWs9e9D" },
  { title: "Valerie", artist: "Amy Winehouse", image: "https://i.scdn.co/image/ab6761610000e5eb8d0b4e14c7a36c5702aa4e2a", link: "https://open.spotify.com/track/2tMz6Jf8IlhYJGmJnVb3hT" },
  { title: "Stand By Me", artist: "Ben E. King", image: "https://i.scdn.co/image/ab6761610000e5eb3a5c89ec10e0a3fa4a833ccf", link: "https://open.spotify.com/track/3SdTKo2uVsxFblQjpScoHy" },
  { title: "Have You Ever Seen the Rain?", artist: "Creedence", image: "https://i.scdn.co/image/ab6761610000e5ebb4c1f8e89142ea5b1dbc88c3", link: "https://open.spotify.com/track/2LawezPeJhN4AWuSB0GtAU" },
  { title: "Everybody Wants to Rule the World", artist: "Tears for Fears", image: "https://i.scdn.co/image/ab6761610000e5ebb4e0e48f8a8987a58d30e275", link: "https://open.spotify.com/track/4RvWPyQ5RL0ao9LPZeSouE" },
  { title: "Locked Out of Heaven", artist: "Bruno Mars", image: "https://i.scdn.co/image/ab6761610000e5ebc36dd9eb55fb0db4911f25dd", link: "https://open.spotify.com/track/3w3o8Kx7ObBGZz6HLoLzhj" },
  { title: "Treasure", artist: "Bruno Mars", image: "https://i.scdn.co/image/ab6761610000e5ebc36dd9eb55fb0db4911f25dd", link: "https://open.spotify.com/track/55h7vJchibLdUkxdlX3fK7" },
  { title: "Get Lucky", artist: "Daft Punk", image: "https://i.scdn.co/image/ab6761610000e5eb4e8a7e14e2f602eb9cba7ff5", link: "https://open.spotify.com/track/2Foc5Q5nqNiosCNqttzHof" },
  { title: "Stayin' Alive", artist: "Bee Gees", image: "https://i.scdn.co/image/ab6761610000e5eb340d3e4e3c627a4ec8228495", link: "https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC" },
  { title: "Wonderwall", artist: "Oasis", image: "https://i.scdn.co/image/ab6761610000e5eb291a4a9bb96686e0c4527e82", link: "https://open.spotify.com/track/1qPbGZqppFwLwcBC1JQ6Vr" },
  { title: "I Want It That Way", artist: "Backstreet Boys", image: "https://i.scdn.co/image/ab6761610000e5eb9a43b87b2ffc190f3067f10c", link: "https://open.spotify.com/track/47BBI51FKFwOMlIiX6m8ya" },
  { title: "Like a Stone", artist: "Audioslave", image: "https://i.scdn.co/image/ab6761610000e5eb3e29a3a8d63fd79f1a2c3543", link: "https://open.spotify.com/track/1y5TK1dSPcc3MPER3mFBSN" },
  { title: "Use Somebody", artist: "Kings of Leon", image: "https://i.scdn.co/image/ab6761610000e5eb08e16d30e5ed27a7b6f6b3c5", link: "https://open.spotify.com/track/2FQrifJ1N335Ljm3TjTVVf" },
  { title: "Heaven", artist: "Bryan Adams", image: "https://i.scdn.co/image/ab6761610000e5eb8bb737cd43a6a1f2e28ffb78", link: "https://open.spotify.com/track/3eR23VReFzcdmS7TYCrhCe" },
  { title: "Every Breath You Take", artist: "Sting", image: "https://i.scdn.co/image/ab6761610000e5ebe6ccff1700b5097274da9fb1", link: "https://open.spotify.com/track/1JSTJqkT5qHq8MDJnJbRE1" },
  { title: "In the End", artist: "Linkin Park", image: "https://i.scdn.co/image/ab6761610000e5eb811da3b2e7c9e5a9c1a6c4f3", link: "https://open.spotify.com/track/60a0Rd6pjrkxjPbaKzXjfq" },
  { title: "Don't Stop Believin'", artist: "Journey", image: "https://i.scdn.co/image/ab6761610000e5ebb51e3a0e3a8a5c65dfeb7a4e", link: "https://open.spotify.com/track/4bHsxqR3GMrXTxEPLuK5ue" },
  { title: "I'll Be Over You", artist: "Toto", image: "https://i.scdn.co/image/ab6761610000e5eb75f9a9b99de3baa7ab5f3f5a", link: "https://open.spotify.com/track/4gMgiXfqyzZLMhsksGmbQV" },
  { title: "Californication", artist: "Red Hot Chili Peppers", image: "https://i.scdn.co/image/ab6761610000e5eb7bdb23e5a1e9e54dff8e5ab3", link: "https://open.spotify.com/track/48UPSzbZjgc449aqKS6RIz" },
  { title: "I Don't Want to Miss a Thing", artist: "Aerosmith", image: "https://i.scdn.co/image/ab6761610000e5eb4b680e2b0baa28bc66f9efc5", link: "https://open.spotify.com/track/5sNESr6gQemGFXSg4C7dCa" },
  { title: "Take on Me", artist: "A-ha", image: "https://i.scdn.co/image/ab6761610000e5eb4fdc189e312c68f4d054a65e", link: "https://open.spotify.com/track/2WfaOiMkCvy7F5fcp2zZ8L" },
  { title: "As It Was", artist: "Harry Styles", image: "https://i.scdn.co/image/ab6761610000e5ebf7db7c8ede90a019c54590bb", link: "https://open.spotify.com/track/4Dvkj6JhhA12EX05fT5y56" },
  { title: "Reptilia", artist: "The Strokes", image: "https://i.scdn.co/image/ab6761610000e5eb8cb5b72f0d21d09ef6e9c7b5", link: "https://open.spotify.com/track/0mMMOhnJSP2sEJPJxcxOqk" },
  { title: "Mr. Brightside", artist: "The Killers", image: "https://i.scdn.co/image/ab6761610000e5eb8a81f8b1e5c9e1e6d5b3b5a8", link: "https://open.spotify.com/track/003vvx7Niy0yvhvHt4a68B" },
  { title: "Do I Wanna Know?", artist: "Arctic Monkeys", image: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f", link: "https://open.spotify.com/track/5FVd6KXrgO9B3JPmGpYav5" },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses", image: "https://i.scdn.co/image/ab6761610000e5ebd212d5bce7f1d4d5c8e3f7a1", link: "https://open.spotify.com/track/7o2CTH4ctstm8TNelqjb51" },
  { title: "Uptown Funk", artist: "Bruno Mars", image: "https://i.scdn.co/image/ab6761610000e5ebc36dd9eb55fb0db4911f25dd", link: "https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS" },
  { title: "Billie Jean", artist: "Michael Jackson", image: "https://i.scdn.co/image/ab6761610000e5eba2a0b9e3448c1e702de9dc06", link: "https://open.spotify.com/track/5ChkMS8OtdzJeqyybCc9R5" },
  { title: "Don't Stop Me Now", artist: "Queen", image: "https://i.scdn.co/image/ab6761610000e5eb0b63ee0d5e9a3b48c4d7b3a2", link: "https://open.spotify.com/track/5T8EDUDqKcs6OSOwEsfqG7" },
  { title: "Livin' on a Prayer", artist: "Bon Jovi", image: "https://i.scdn.co/image/ab6761610000e5eb68faa7b1ca8e2d3b5a4edc7c", link: "https://open.spotify.com/track/37ZJ0p5Jm13JPevGcx4SkF" },
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {songs.map((song, index) => (
            <a
              key={`${song.artist}-${song.title}`}
              ref={(el) => { cardsRef.current[index] = el; }}
              href={song.link}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-surface rounded-sm group hover:border-primary/40 transition-all duration-150 hover:scale-[1.03] hover:shadow-[0_0_20px_hsla(43,59%,52%,0.15)] block overflow-hidden"
              style={{ perspective: "800px", transformStyle: "preserve-3d" }}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={song.image}
                  alt={song.artist}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center bg-secondary/50" style={{ display: "none" }}>
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
          className="text-center mt-16"
        >
          <p className="font-body text-sm text-muted-foreground mb-6">
            Essas são apenas algumas. A lista completa com {">"}100 músicas organizadas em 16 blocos temáticos espera por vocês.
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
