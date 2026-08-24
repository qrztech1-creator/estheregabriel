import { useState } from "react";
import { Eye, ExternalLink, X } from "lucide-react";

export interface MediaEntry {
  id?: string;
  kind?: "image" | "video" | "link";
  url: string;
  title?: string;
}

const youtubeId = (url: string) => {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/);
  return m?.[1] || null;
};

const MediaViewer = ({ item, onClose }: { item: MediaEntry; onClose: () => void }) => {
  const yt = youtubeId(item.url);
  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog" aria-modal="true" onClick={onClose}>
      <button onClick={onClose} aria-label="Fechar" className="absolute top-4 right-4 text-foreground/70 hover:text-foreground">
        <X className="w-6 h-6" />
      </button>
      <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
        {yt ? (
          <div className="aspect-video w-full">
            <iframe src={`https://www.youtube.com/embed/${yt}?autoplay=1`} title={item.title || "Vídeo"}
              allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen
              className="w-full h-full rounded-sm border border-border/40" />
          </div>
        ) : item.kind === "video" ? (
          <video src={item.url} controls autoPlay className="w-full max-h-[80vh] rounded-sm border border-border/40" />
        ) : (
          <img src={item.url} alt={item.title || "Mídia"} className="w-full max-h-[80vh] object-contain rounded-sm" />
        )}
        {item.title && <p className="font-body text-sm text-muted-foreground text-center mt-3">{item.title}</p>}
      </div>
    </div>
  );
};

const MediaGallery = ({ media, compact = false }: { media?: MediaEntry[] | null; compact?: boolean }) => {
  const [active, setActive] = useState<MediaEntry | null>(null);
  const list = (Array.isArray(media) ? media : []).filter(m => m?.url);
  if (!list.length) return null;

  return (
    <>
      <div className={`flex flex-wrap gap-2 ${compact ? "" : "mt-3"}`}>
        {list.map((m, i) => {
          const isExternalLink = m.kind === "link" && !youtubeId(m.url);
          if (isExternalLink) {
            return (
              <a key={m.id || i} href={m.url} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border/60 text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
                <ExternalLink className="w-3 h-3" /> {m.title || "Abrir link"}
              </a>
            );
          }
          return (
            <button key={m.id || i} type="button"
              onClick={e => { e.stopPropagation(); e.preventDefault(); setActive(m); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-primary/40 text-[10px] tracking-[0.15em] uppercase text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
              <Eye className="w-3 h-3" /> {m.title || (m.kind === "video" ? "Ver vídeo" : "Ver imagem")}
            </button>
          );
        })}
      </div>
      {active && <MediaViewer item={active} onClose={() => setActive(null)} />}
    </>
  );
};

export default MediaGallery;
