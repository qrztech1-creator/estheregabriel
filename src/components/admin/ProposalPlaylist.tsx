import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Save, ChevronDown, ChevronRight, Music, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SortableList from "./SortableList";

interface Props { proposalId: string }

const ProposalPlaylist = ({ proposalId }: Props) => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [proposalId]);

  const load = async () => {
    const [{ data: b }, { data: s }] = await Promise.all([
      supabase.from("playlist_blocks").select("*").eq("proposal_id", proposalId).order("display_order"),
      supabase.from("playlist_songs").select("*").eq("proposal_id", proposalId).order("display_order"),
    ]);
    setBlocks(b || []);
    setSongs(s || []);
  };

  const addBlock = async () => {
    const { data, error } = await supabase.from("playlist_blocks")
      .insert({ proposal_id: proposalId, name: "Novo bloco", display_order: blocks.length })
      .select().single();
    if (error) { toast.error("Erro ao criar bloco"); return; }
    setBlocks([...blocks, data]);
    setOpen(o => ({ ...o, [data.id]: true }));
  };

  const removeBlock = async (id: string) => {
    await supabase.from("playlist_songs").delete().eq("block_id", id);
    await supabase.from("playlist_blocks").delete().eq("id", id);
    setBlocks(bs => bs.filter(b => b.id !== id));
    setSongs(ss => ss.filter(s => s.block_id !== id));
  };

  const addSong = async (blockId: string) => {
    const { data, error } = await supabase.from("playlist_songs").insert({
      proposal_id: proposalId, block_id: blockId, title: "Nova música",
      display_order: songs.filter(s => s.block_id === blockId).length, energy: 3,
    }).select().single();
    if (error) { toast.error("Erro ao criar música"); return; }
    setSongs([...songs, data]);
  };

  const patchSong = (id: string, patch: Record<string, any>) =>
    setSongs(ss => ss.map(s => (s.id === id ? { ...s, ...patch } : s)));

  const removeSong = async (id: string) => {
    await supabase.from("playlist_songs").delete().eq("id", id);
    setSongs(ss => ss.filter(s => s.id !== id));
  };

  const songsOf = (blockId: string) =>
    songs.filter(s => s.block_id === blockId).sort((a, b) => a.display_order - b.display_order);

  const reorderSongs = (blockId: string, list: any[]) => {
    const ordered = list.map((s, i) => ({ ...s, display_order: i }));
    setSongs(ss => [...ss.filter(s => s.block_id !== blockId), ...ordered]);
  };

  const saveAll = async () => {
    setSaving(true);
    const ops = [
      ...blocks.map((b, i) => supabase.from("playlist_blocks").update({ name: b.name, display_order: i }).eq("id", b.id)),
      ...songs.map(s => supabase.from("playlist_songs").update({
        title: s.title, artist: s.artist, display_order: s.display_order,
        cover_url: s.cover_url || null, spotify_url: s.spotify_url || null,
        youtube_url: s.youtube_url || null, energy: Number(s.energy) || 3,
      }).eq("id", s.id)),
    ];
    const res = await Promise.all(ops);
    setSaving(false);
    if (res.some(r => r.error)) { toast.error("Erro ao salvar repertório"); return; }
    toast.success("Repertório salvo!");
    load();
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Cadastre capa, links de Spotify/YouTube e a energia (1 a 5) de cada faixa. Arraste para reordenar blocos e músicas.
      </p>

      <SortableList
        items={blocks}
        getId={b => b.id}
        onReorder={setBlocks}
        className="space-y-3"
        renderItem={(b) => {
          const isOpen = !!open[b.id];
          const list = songsOf(b.id);
          return (
            <div className="bg-card border border-border rounded-xl">
              <div className="flex items-center gap-2 p-3">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(o => ({ ...o, [b.id]: !isOpen }))}>
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
                <Input value={b.name} onChange={e => setBlocks(bs => bs.map(x => (x.id === b.id ? { ...x, name: e.target.value } : x)))} className="h-8 flex-1 font-medium" />
                <span className="text-xs text-muted-foreground whitespace-nowrap">{list.length} músicas</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeBlock(b.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
              </div>

              {isOpen && (
                <div className="px-3 pb-4 space-y-2 border-t border-border pt-3">
                  <SortableList
                    items={list}
                    getId={s => s.id}
                    onReorder={l => reorderSongs(b.id, l)}
                    renderItem={(s) => (
                      <div className="rounded-lg border border-border/70 p-2 space-y-2">
                        <div className="flex items-center gap-2">
                          {s.cover_url
                            ? <img src={s.cover_url} alt={s.title} className="w-9 h-9 rounded object-cover flex-shrink-0" />
                            : <div className="w-9 h-9 rounded bg-muted flex items-center justify-center flex-shrink-0"><Music className="w-4 h-4 text-muted-foreground" /></div>}
                          <Input value={s.title} onChange={e => patchSong(s.id, { title: e.target.value })} className="h-8 text-xs flex-1" placeholder="Título" />
                          <Input value={s.artist || ""} onChange={e => patchSong(s.id, { artist: e.target.value })} className="h-8 text-xs flex-1" placeholder="Artista" />
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeSong(s.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                          <Input value={s.cover_url || ""} onChange={e => patchSong(s.id, { cover_url: e.target.value })} className="h-8 col-span-12 sm:col-span-4 text-xs" placeholder="URL da capa" />
                          <Input value={s.spotify_url || ""} onChange={e => patchSong(s.id, { spotify_url: e.target.value })} className="h-8 col-span-6 sm:col-span-4 text-xs" placeholder="Link Spotify" />
                          <Input value={s.youtube_url || ""} onChange={e => patchSong(s.id, { youtube_url: e.target.value })} className="h-8 col-span-6 sm:col-span-3 text-xs" placeholder="Link YouTube" />
                          <Input type="number" min={1} max={5} value={s.energy ?? 3} onChange={e => patchSong(s.id, { energy: Number(e.target.value) })} className="h-8 col-span-12 sm:col-span-1 text-xs" title="Energia 1-5" />
                        </div>
                      </div>
                    )}
                  />
                  <Button variant="outline" size="sm" className="gap-1 text-xs h-7" onClick={() => addSong(b.id)}>
                    <Plus className="w-3 h-3" /> Música
                  </Button>
                </div>
              )}
            </div>
          );
        }}
      />

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={addBlock}><Plus className="w-3.5 h-3.5" /> Novo bloco</Button>
        <Button size="sm" className="gap-1.5" onClick={saveAll} disabled={saving}>
          <Save className="w-3.5 h-3.5" /> {saving ? "Salvando..." : "Salvar repertório"}
        </Button>
      </div>

      {!blocks.length && (
        <div className="text-center py-10 text-muted-foreground text-sm flex flex-col items-center gap-2">
          <ImageIcon className="w-6 h-6" /> Nenhum bloco de repertório ainda.
        </div>
      )}
    </div>
  );
};

export default ProposalPlaylist;
