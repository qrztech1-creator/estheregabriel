import { useRef, useState, useEffect } from "react";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackgroundMusicProps {
  startPlaying?: boolean;
  audioUrl?: string;
}

const BackgroundMusic = ({ startPlaying = false, audioUrl = "/audio/background-music.mp3" }: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [volume, setVolume] = useState(() => {
    const stored = window.localStorage.getItem("proposal-music-volume");
    const parsed = stored === null ? 0.25 : Number(stored);
    return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0.25;
  });

  useEffect(() => {
    if (startPlaying && !started) {
      setStarted(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.volume = volume;
          audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
        }
      }, 0);
    }
  }, [startPlaying, started, volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    window.localStorage.setItem("proposal-music-volume", String(volume));
  }, [volume]);

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
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 rounded-sm border border-border bg-secondary/90 p-2 shadow-lg backdrop-blur-sm">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="h-10 w-10 flex-shrink-0"
        aria-label={playing ? "Pausar música" : "Tocar música"}
      >
        {!playing || volume === 0 ? (
          <VolumeX className="w-5 h-5 text-muted-foreground" />
        ) : volume < 0.5 ? (
          <Volume1 className="w-5 h-5 text-primary" />
        ) : (
          <Volume2 className="w-5 h-5 text-primary animate-pulse" />
        )}
      </Button>
      <label className="flex items-center gap-2 pr-2" aria-label="Volume da música">
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          className="w-24 sm:w-32 accent-primary"
          aria-label="Volume da música"
        />
        <span className="w-8 text-right font-ui text-[10px] tabular-nums text-muted-foreground">
          {Math.round(volume * 100)}%
        </span>
      </label>
      </div>
    </>
  );
};

export default BackgroundMusic;
