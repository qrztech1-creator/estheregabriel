import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronUp, ChevronDown, Music, Plus, Send, ExternalLink, MessageCircle, Trash2, Link2 } from "lucide-react";
import logo from "@/assets/logo-homemusic.png";
import { toast } from "sonner";

interface Block {
  id: string;
  name: string;
  display_order: number;
}

interface Song {
  id: string;
  block_id: string;
  title: string;
  artist: string | null;
  display_order: number;
}

interface Preference {
  song_id: string;
  status: string;
}

interface Suggestion {
  id: string;
  title: string;
  artist: string | null;
  notes: string | null;
  created_at: string;
}

interface DjLink {
  id: string;
  spotify_url: string;
  name: string | null;
  created_at: string;
}

const PlaylistPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [clientTokenId, setClientTokenId] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [preferences, setPreferences] = useState<Map<string, string>>(new Map());
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [djLinks, setDjLinks] = useState<DjLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSuggestion, setNewSuggestion] = useState({ title: "", artist: "", notes: "" });
  const [newDjLink, setNewDjLink] = useState({ url: "", name: "" });
  const [blockOrders, setBlockOrders] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      const { data: tokenData } = await supabase
        .from("client_tokens")
        .select("*")
        .eq("token", token!)
        .maybeSingle();

      if (!tokenData) { navigate("/"); return; }
      setClientTokenId(tokenData.id);
      setClientName(tokenData.client_name);

      const proposalId = tokenData.proposal_id;

      const [blocksRes, songsRes, prefsRes, suggestionsRes, djLinksRes, blockOrdersRes] = await Promise.all([
        supabase.from("playlist_blocks").select("*").eq("proposal_id", proposalId).order("display_order"),
        supabase.from("playlist_songs").select("*").eq("proposal_id", proposalId).order("display_order"),
        supabase.from("song_preferences").select("*").eq("client_token_id", tokenData.id),
        supabase.from("song_suggestions").select("*").eq("client_token_id", tokenData.id).order("created_at", { ascending: false }),
        supabase.from("dj_playlist_links").select("*").eq("client_token_id", tokenData.id).order("created_at", { ascending: false }),
        supabase.from("block_order_preferences").select("*").eq("client_token_id", tokenData.id),
      ]);

      setBlocks(blocksRes.data || []);
      setSongs(songsRes.data || []);
      
      const prefsMap = new Map<string, string>();
      (prefsRes.data || []).forEach((p: any) => prefsMap.set(p.song_id, p.status));
      setPreferences(prefsMap);
      
      setSuggestions(suggestionsRes.data || []);
      setDjLinks(djLinksRes.data || []);
      
      const ordersMap = new Map<string, number>();
      (blockOrdersRes.data || []).forEach((o: any) => ordersMap.set(o.block_id, o.display_order));
      setBlockOrders(ordersMap);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const getBlockOrder = (block: Block) => blockOrders.get(block.id) ?? block.display_order;
  const sortedBlocks = [...blocks].sort((a, b) => getBlockOrder(a) - getBlockOrder(b));

  const toggleSongPreference = async (songId: string, newStatus: string) => {
    if (!clientTokenId) return;
    const currentStatus = preferences.get(songId);
    const finalStatus = currentStatus === newStatus ? "pending" : newStatus;

    const newPrefs = new Map(preferences);
    if (finalStatus === "pending") {
      newPrefs.delete(songId);
    } else {
      newPrefs.set(songId, finalStatus);
    }
    setPreferences(newPrefs);

    try {
      if (finalStatus === "pending") {
        await supabase.from("song_preferences")
          .delete()
          .eq("client_token_id", clientTokenId)
          .eq("song_id", songId);
      } else {
        await supabase.from("song_preferences")
          .upsert({
            client_token_id: clientTokenId,
            song_id: songId,
            status: finalStatus,
            updated_at: new Date().toISOString(),
          }, { onConflict: "client_token_id,song_id" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar preferência");
    }
  };

  const moveBlock = async (blockId: string, direction: "up" | "down") => {
    const idx = sortedBlocks.findIndex(b => b.id === blockId);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === sortedBlocks.length - 1)) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const newOrders = new Map(blockOrders);
    const currentOrder = getBlockOrder(sortedBlocks[idx]);
    const swapOrder = getBlockOrder(sortedBlocks[swapIdx]);
    
    newOrders.set(sortedBlocks[idx].id, swapOrder);
    newOrders.set(sortedBlocks[swapIdx].id, currentOrder);
    setBlockOrders(newOrders);

    if (!clientTokenId) return;
    try {
      await supabase.from("block_order_preferences").upsert([
        { client_token_id: clientTokenId, block_id: sortedBlocks[idx].id, display_order: swapOrder },
        { client_token_id: clientTokenId, block_id: sortedBlocks[swapIdx].id, display_order: currentOrder },
      ], { onConflict: "client_token_id,block_id" });
    } catch (err) {
      console.error(err);
    }
  };

  const addSuggestion = async () => {
    if (!clientTokenId || !newSuggestion.title.trim()) return;
    try {
      const { data } = await supabase.from("song_suggestions").insert({
        client_token_id: clientTokenId,
        title: newSuggestion.title,
        artist: newSuggestion.artist || null,
        notes: newSuggestion.notes || null,
      }).select().single();
      if (data) setSuggestions([data, ...suggestions]);
      setNewSuggestion({ title: "", artist: "", notes: "" });
      toast.success("Sugestão adicionada!");
    } catch (err) {
      toast.error("Erro ao adicionar sugestão");
    }
  };

  const deleteSuggestion = async (id: string) => {
    try {
      await supabase.from("song_suggestions").delete().eq("id", id);
      setSuggestions(suggestions.filter(s => s.id !== id));
      toast.success("Sugestão removida");
    } catch (err) {
      toast.error("Erro ao remover sugestão");
    }
  };

  const addDjLink = async () => {
    if (!clientTokenId || !newDjLink.url.trim()) return;
    try {
      const { data } = await supabase.from("dj_playlist_links").insert({
        client_token_id: clientTokenId,
        spotify_url: newDjLink.url,
        name: newDjLink.name || null,
      }).select().single();
      if (data) setDjLinks([data, ...djLinks]);
      setNewDjLink({ url: "", name: "" });
      toast.success("Playlist do DJ salva!");
    } catch (err) {
      toast.error("Erro ao salvar link");
    }
  };

  const deleteDjLink = async (id: string) => {
    try {
      await supabase.from("dj_playlist_links").delete().eq("id", id);
      setDjLinks(djLinks.filter(l => l.id !== id));
      toast.success("Link removido");
    } catch (err) {
      toast.error("Erro ao remover link");
    }
  };

  const whatsappLink = (msg: string) => `https://wa.me/5527999936682?text=${encodeURIComponent(msg)}`;

  const totalSongs = songs.length;
  const rejected = Array.from(preferences.values()).filter(s => s === "rejected").length;
  const approved = Array.from(preferences.values()).filter(s => s === "approved").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
          <Music className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grain-overlay">
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between glass-surface px-4 py-2.5 rounded-sm">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Home Music" className="h-7 w-auto" />
          </div>
          <div className="flex items-center gap-3">
            <span className="font-body text-xs text-muted-foreground hidden sm:block">{clientName}</span>
            <a
              href={whatsappLink("Olá! Estou personalizando minha playlist no site e gostaria de tirar uma dúvida.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-sm font-ui text-[10px] tracking-[0.15em] uppercase"
            >
              <MessageCircle className="w-3 h-3" />
              Contato
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-20 px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-ui text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Curadoria Musical Personalizada
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-gold-gradient mb-4">
            Seu Repertório
          </h1>
          <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto">
            Marque as músicas que vocês amam ou descarte as que não combinam. 
            Reordenem os blocos como preferirem e adicionem sugestões ao final.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-12 max-w-md mx-auto"
        >
          <div className="glass-surface p-4 rounded-sm text-center">
            <p className="font-display text-2xl text-foreground">{totalSongs}</p>
            <p className="font-ui text-[9px] tracking-wider uppercase text-muted-foreground">Total</p>
          </div>
          <div className="glass-surface p-4 rounded-sm text-center">
            <p className="font-display text-2xl text-primary">{approved}</p>
            <p className="font-ui text-[9px] tracking-wider uppercase text-muted-foreground">Aprovadas</p>
          </div>
          <div className="glass-surface p-4 rounded-sm text-center">
            <p className="font-display text-2xl text-destructive">{rejected}</p>
            <p className="font-ui text-[9px] tracking-wider uppercase text-muted-foreground">Descartadas</p>
          </div>
        </motion.div>

        <div className="space-y-8">
          {sortedBlocks.map((block, blockIdx) => {
            const blockSongs = songs.filter(s => s.block_id === block.id).sort((a, b) => a.display_order - b.display_order);
            const blockRejected = blockSongs.filter(s => preferences.get(s.id) === "rejected").length;

            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: blockIdx * 0.05 }}
                className="glass-surface rounded-sm overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="font-ui text-[10px] tracking-wider text-primary tabular-nums w-6">
                      {String(blockIdx + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-xl md:text-2xl font-light text-foreground">
                      {block.name}
                    </h2>
                    <span className="font-body text-xs text-muted-foreground">
                      {blockSongs.length} músicas{blockRejected > 0 && ` · ${blockRejected} descartada${blockRejected > 1 ? "s" : ""}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveBlock(block.id, "up")}
                      disabled={blockIdx === 0}
                      className="p-1.5 rounded-sm hover:bg-secondary disabled:opacity-20 transition-colors"
                    >
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => moveBlock(block.id, "down")}
                      disabled={blockIdx === sortedBlocks.length - 1}
                      className="p-1.5 rounded-sm hover:bg-secondary disabled:opacity-20 transition-colors"
                    >
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-border/50">
                  {blockSongs.map((song) => {
                    const status = preferences.get(song.id) || "pending";
                    return (
                      <motion.div
                        key={song.id}
                        layout
                        className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 ${
                          status === "rejected" ? "opacity-40 bg-destructive/5" : 
                          status === "approved" ? "bg-primary/5" : ""
                        }`}
                      >
                        <span className="font-body text-xs text-muted-foreground tabular-nums w-5">
                          {song.display_order}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-body text-sm truncate ${status === "rejected" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                            {song.title}
                          </p>
                          {song.artist && (
                            <p className="font-body text-xs text-muted-foreground truncate">{song.artist}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => toggleSongPreference(song.id, "approved")}
                            className={`p-1.5 rounded-sm transition-all duration-200 ${
                              status === "approved" 
                                ? "bg-primary text-primary-foreground" 
                                : "hover:bg-primary/20 text-muted-foreground hover:text-primary"
                            }`}
                            title="Aprovar"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleSongPreference(song.id, "rejected")}
                            className={`p-1.5 rounded-sm transition-all duration-200 ${
                              status === "rejected" 
                                ? "bg-destructive text-destructive-foreground" 
                                : "hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                            }`}
                            title="Essa não"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center justify-center py-16">
          <div className="w-px h-24 timeline-line" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-light text-gold-gradient mb-2">
              Suas Sugestões
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              Tem uma música que não está na lista? Sugira aqui e vamos avaliar!
            </p>
          </div>

          <div className="glass-surface p-6 rounded-sm mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="Nome da música *"
                value={newSuggestion.title}
                onChange={(e) => setNewSuggestion({ ...newSuggestion, title: e.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-body"
              />
              <input
                type="text"
                placeholder="Artista"
                value={newSuggestion.artist}
                onChange={(e) => setNewSuggestion({ ...newSuggestion, artist: e.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-body"
              />
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Observação (opcional)"
                value={newSuggestion.notes}
                onChange={(e) => setNewSuggestion({ ...newSuggestion, notes: e.target.value })}
                className="flex-1 bg-secondary/50 border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-body"
              />
              <button
                onClick={addSuggestion}
                disabled={!newSuggestion.title.trim()}
                className="px-4 py-2.5 bg-primary text-primary-foreground rounded-sm font-ui text-xs tracking-wider uppercase disabled:opacity-40 hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </button>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className="space-y-2">
              {suggestions.map((s) => (
                <div key={s.id} className="glass-surface p-4 rounded-sm flex items-start justify-between gap-3">
                  <div>
                    <p className="font-body text-sm text-foreground">{s.title} {s.artist && `— ${s.artist}`}</p>
                    {s.notes && <p className="font-body text-xs text-muted-foreground mt-1">{s.notes}</p>}
                  </div>
                  <button
                    onClick={() => deleteSuggestion(s.id)}
                    className="p-1.5 rounded-sm hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-light text-gold-gradient mb-2">
              Playlist do DJ
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              Cole o link da playlist do Spotify para o DJ. Pode adicionar quantas quiser.
            </p>
          </div>

          <div className="glass-surface p-6 rounded-sm mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Link da playlist do Spotify"
                value={newDjLink.url}
                onChange={(e) => setNewDjLink({ ...newDjLink, url: e.target.value })}
                className="flex-1 bg-secondary/50 border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-body"
              />
              <input
                type="text"
                placeholder="Nome (opcional)"
                value={newDjLink.name}
                onChange={(e) => setNewDjLink({ ...newDjLink, name: e.target.value })}
                className="w-40 bg-secondary/50 border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-body hidden sm:block"
              />
              <button
                onClick={addDjLink}
                disabled={!newDjLink.url.trim()}
                className="px-4 py-2.5 bg-primary text-primary-foreground rounded-sm font-ui text-xs tracking-wider uppercase disabled:opacity-40 hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Link2 className="w-3.5 h-3.5" />
                Salvar
              </button>
            </div>
          </div>

          {djLinks.length > 0 && (
            <div className="space-y-2">
              {djLinks.map((link) => (
                <div key={link.id} className="glass-surface p-4 rounded-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <a href={link.spotify_url} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-primary hover:text-foreground transition-colors truncate block">
                        {link.name || link.spotify_url}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteDjLink(link.id)}
                    className="p-1.5 rounded-sm hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center py-12"
        >
          <p className="font-body text-sm text-muted-foreground mb-6">
            Finalizou a curadoria? Fale com a gente para alinhar os detalhes finais.
          </p>
          <a
            href={whatsappLink(`Olá! Finalizei a personalização do repertório do casamento. Aprovei ${approved} músicas, descartei ${rejected} e adicionei ${suggestions.length} sugestões. Podemos alinhar os próximos passos?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-sm breathing-glow font-ui text-xs tracking-[0.15em] uppercase"
          >
            <Send className="w-4 h-4" />
            Enviar Curadoria Finalizada
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default PlaylistPage;
