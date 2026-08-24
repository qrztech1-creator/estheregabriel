import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Image as ImageIcon, Link2, Trash2, Upload, Video, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface MediaEntry {
  id: string;
  kind: "image" | "video" | "link";
  url: string;
  title?: string;
}

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

const guessKind = (url: string): MediaEntry["kind"] => {
  const u = url.toLowerCase().split("?")[0];
  if (/\.(png|jpe?g|webp|gif|avif|svg)$/.test(u)) return "image";
  if (/\.(mp4|webm|mov|m4v)$/.test(u) || u.includes("youtube.com") || u.includes("youtu.be") || u.includes("vimeo.com")) return "video";
  return "link";
};

export const uploadProposalMedia = async (file: File): Promise<string | null> => {
  const ext = file.name.split(".").pop() || "bin";
  const path = `uploads/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("proposal-media").upload(path, file, {
    cacheControl: "31536000", upsert: false,
  });
  if (error) { toast.error("Falha no upload: " + error.message); return null; }
  const { data } = await supabase.storage.from("proposal-media").createSignedUrl(path, TEN_YEARS);
  if (!data?.signedUrl) { toast.error("Falha ao gerar link do arquivo"); return null; }
  return data.signedUrl;
};

interface Props {
  media: MediaEntry[];
  onChange: (media: MediaEntry[]) => void;
  label?: string;
}

const icons = { image: ImageIcon, video: Video, link: Link2 };

const MediaEditor = ({ media, onChange, label = "Mídias (imagens, vídeos e links)" }: Props) => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const list = Array.isArray(media) ? media : [];

  const add = (entry: Omit<MediaEntry, "id">) =>
    onChange([...list, { id: crypto.randomUUID(), ...entry }]);

  const addLink = () => {
    const clean = url.trim();
    if (!clean) return;
    add({ kind: guessKind(clean), url: clean, title: title.trim() || undefined });
    setUrl(""); setTitle("");
  };

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const uploaded: MediaEntry[] = [];
    for (const file of Array.from(files)) {
      const signed = await uploadProposalMedia(file);
      if (signed) {
        uploaded.push({
          id: crypto.randomUUID(),
          kind: file.type.startsWith("video") ? "video" : "image",
          url: signed,
          title: file.name,
        });
      }
    }
    if (uploaded.length) {
      onChange([...list, ...uploaded]);
      toast.success(uploaded.length === 1 ? "Mídia adicionada" : `${uploaded.length} mídias adicionadas`);
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-3 rounded-md border border-primary/30 bg-primary/5 p-3">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="mt-0.5 text-xs text-muted-foreground">Envie imagens ou vídeos do dispositivo, ou cole um link. A mídia aparecerá no card para o cliente abrir em tela cheia.</p>
      </div>

      {list.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {list.map((m, idx) => {
            const Icon = icons[m.kind] || Link2;
            return (
              <div key={m.id || idx} className="relative rounded-lg border border-border bg-background/50 overflow-hidden">
                {m.kind === "image" ? (
                  <img src={m.url} alt={m.title || "mídia"} className="w-full h-20 object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-20 flex items-center justify-center bg-muted/40"><Icon className="w-5 h-5 text-muted-foreground" /></div>
                )}
                <div className="p-1.5 flex items-center gap-1">
                  <input
                    value={m.title || ""}
                    placeholder="Título (opcional)"
                    onChange={e => onChange(list.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)))}
                    className="flex-1 min-w-0 bg-transparent text-[11px] outline-none"
                  />
                  <button type="button" onClick={() => onChange(list.filter((_, i) => i !== idx))} aria-label="Remover mídia">
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addLink(); } }} placeholder="Cole o link da imagem, vídeo, YouTube ou Drive" className="h-10 text-xs flex-1" />
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" className="h-9 text-xs sm:w-40" />
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" className="h-10 gap-1 flex-1 sm:flex-none" onClick={addLink} disabled={!url.trim()}>
            <Plus className="w-3.5 h-3.5" /> Adicionar link
          </Button>
          <Button type="button" size="sm" className="h-10 gap-1 flex-1 sm:flex-none" disabled={busy}
            onClick={() => fileRef.current?.click()}>
            <Upload className="w-3.5 h-3.5" /> {busy ? "Enviando..." : "Subir do dispositivo"}
          </Button>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={e => onFiles(e.target.files)} />
    </div>
  );
};

export default MediaEditor;
