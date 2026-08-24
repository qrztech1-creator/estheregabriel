import { useRef, useState, useEffect, useCallback } from "react";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackgroundMusicProps {
  startPlaying?: boolean;
  audioUrl?: string;
}

const readStoredVolume = () => {
  if (typeof window === "undefined") return 0.25;
  const stored = window.localStorage.getItem("proposal-music-volume");
  const parsed = stored === null ? 0.25 : Number(stored);
  return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0.25;
};

const BackgroundMusic = ({ startPlaying = false, audioUrl = "/audio/background-music.mp3" }: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [volume, setVolume] = useState(readStoredVolume);
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  // Keeps the element in sync no matter when it (re)mounts or reloads its source.
  const applyVolume = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = volumeRef.current;
    el.muted = volumeRef.current === 0;
  }, []);

  useEffect(() => {
    applyVolume();
    window.localStorage.setItem("proposal-music-volume", String(volume));
  }, [volume, applyVolume]);

  useEffect(() => {
    if (!startPlaying || started) return;
    setStarted(true);
    const el = audioRef.current;
    if (!el) return;
    applyVolume();
    el.play().then(() => setPlaying(true)).catch(() => {});
  }, [startPlaying, started, applyVolume]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      applyVolume();
      el.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
        onLoadedMetadata={applyVolume}
        onCanPlay={applyVolume}
        onPlay={applyVolume}
      />
      {started && (
        <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2 rounded-sm border border-border bg-secondary/90 p-1.5 sm:p-2 shadow-lg backdrop-blur-sm max-w-[calc(100vw-1.5rem)]">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
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
          <label className="flex items-center gap-2 pr-1 sm:pr-2" aria-label="Volume da música">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              onInput={(event) => setVolume(Number((event.target as HTMLInputElement).value))}
              className="w-20 sm:w-32 accent-primary touch-none"
              aria-label="Volume da música"
            />
            <span className="w-8 text-right font-ui text-[10px] tabular-nums text-muted-foreground">
              {Math.round(volume * 100)}%
            </span>
          </label>
        </div>
      )}
    </>
  );
};

export default BackgroundMusic;
