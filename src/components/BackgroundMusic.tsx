import { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface BackgroundMusicProps {
  startPlaying?: boolean;
  audioUrl?: string;
}

const BackgroundMusic = ({ startPlaying = false, audioUrl = "/audio/background-music.mp3" }: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (startPlaying && !started) {
      setStarted(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.volume = 0.25;
          audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
        }
      }, 0);
    }
  }, [startPlaying, started]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  if (!started) return <audio ref={audioRef} src={audioUrl} loop preload="auto" />;

  return (
    <>
      <audio ref={audioRef} src={audioUrl} loop preload="auto" />
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-secondary/80 backdrop-blur-sm border border-border hover:border-primary/40 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
        aria-label={playing ? "Pausar música" : "Tocar música"}
      >
        {playing ? (
          <Volume2 className="w-5 h-5 text-primary animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
    </>
  );
};

export default BackgroundMusic;
