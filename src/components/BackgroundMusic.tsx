import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const tryPlay = () => {
      if (hasInteracted) return;
      setHasInteracted(true);
      if (audioRef.current) {
        audioRef.current.volume = 0.25;
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("scroll", tryPlay);
      document.removeEventListener("touchstart", tryPlay);
    };

    document.addEventListener("click", tryPlay);
    document.addEventListener("scroll", tryPlay);
    document.addEventListener("touchstart", tryPlay);

    return () => {
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("scroll", tryPlay);
      document.removeEventListener("touchstart", tryPlay);
    };
  }, [hasInteracted]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/background-music.mp3" loop preload="auto" />
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
