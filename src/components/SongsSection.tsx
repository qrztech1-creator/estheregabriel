import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

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
    title: "Just The Way You Are",
    artist: "Bruno Mars",
    year: "2010",
    spotifyUrl: "https://open.spotify.com/track/7BqBn9nzAq8spo5e7cZ0dJ",
    youtubeUrl: "https://www.youtube.com/watch?v=LjhCEhWiKXk",
    cover: "https://i.scdn.co/image/ab67616d0000b273f8861bcff39f3f498e9e8393",
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
];

const SongsSection = () => {
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="font-ui text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Repertório Sugerido
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-gold-gradient">
            A Trilha Sonora
          </h2>
          <p className="font-body text-muted-foreground mt-6 max-w-xl mx-auto">
            Hits cuidadosamente selecionados para criar a atmosfera perfeita. Vocês também poderão montar a playlist do DJ e sugerir músicas para a banda.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs.map((song, index) => (
            <motion.div
              key={`${song.artist}-${song.title}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="glass-surface p-4 rounded-sm group hover:border-primary/40 transition-all duration-500 hover:scale-[1.02]"
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
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-12 font-body"
        >
          Esta é apenas uma amostra. Vocês terão total liberdade para personalizar o repertório da banda e do DJ.
        </motion.p>
      </div>
    </section>
  );
};

export default SongsSection;
