import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Music, ThumbsUp, ThumbsDown, MinusCircle, MessageCircle, Link2, ArrowUpDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientToken {
  id: string;
  token: string;
  client_name: string;
  created_at: string;
}

interface SongPref {
  id: string;
  song_id: string;
  status: string;
  updated_at: string;
  song_title?: string;
  song_artist?: string;
  block_name?: string;
}

interface SongSuggestion {
  id: string;
  title: string;
  artist: string | null;
  notes: string | null;
  created_at: string;
  client_name?: string;
}

interface DjLink {
  id: string;
  spotify_url: string;
  name: string | null;
  created_at: string;
  client_name?: string;
}

interface BlockOrderPref {
  id: string;
  block_id: string;
  display_order: number;
  block_name?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ClientToken[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<SongPref[]>([]);
  const [suggestions, setSuggestions] = useState<SongSuggestion[]>([]);
  const [djLinks, setDjLinks] = useState<DjLink[]>([]);
  const [blockOrders, setBlockOrders] = useState<BlockOrderPref[]>([]);
  const [activeTab, setActiveTab] = useState<"preferences" | "suggestions" | "links" | "blocks">("preferences");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      loadClientData(selectedClient);
    }
  }, [selectedClient]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin/login");
      return;
    }
    loadClients();
  };

  const loadClients = async () => {
    const { data } = await supabase.from("client_tokens").select("*").order("created_at", { ascending: false });
    if (data) {
      setClients(data);
      if (data.length > 0) setSelectedClient(data[0].id);
    }
    setLoading(false);
  };

  const loadClientData = async (clientId: string) => {
    // Load all data in parallel
    const [prefsRes, suggestionsRes, linksRes, blockOrderRes, songsRes, blocksRes] = await Promise.all([
      supabase.from("song_preferences").select("*").eq("client_token_id", clientId).order("updated_at", { ascending: false }),
      supabase.from("song_suggestions").select("*").eq("client_token_id", clientId).order("created_at", { ascending: false }),
      supabase.from("dj_playlist_links").select("*").eq("client_token_id", clientId).order("created_at", { ascending: false }),
      supabase.from("block_order_preferences").select("*").eq("client_token_id", clientId).order("display_order"),
      supabase.from("playlist_songs").select("*"),
      supabase.from("playlist_blocks").select("*"),
    ]);

    const songsMap = new Map((songsRes.data || []).map(s => [s.id, s]));
    const blocksMap = new Map((blocksRes.data || []).map(b => [b.id, b]));

    // Enrich preferences with song/block info
    const enrichedPrefs = (prefsRes.data || []).map(p => {
      const song = songsMap.get(p.song_id);
      const block = song ? blocksMap.get(song.block_id) : null;
      return {
        ...p,
        song_title: song?.title || "Desconhecida",
        song_artist: song?.artist || "",
        block_name: block?.name || "",
      };
    });

    const enrichedBlockOrders = (blockOrderRes.data || []).map(bo => ({
      ...bo,
      block_name: blocksMap.get(bo.block_id)?.name || "Desconhecido",
    }));

    setPreferences(enrichedPrefs);
    setSuggestions(suggestionsRes.data || []);
    setDjLinks(linksRes.data || []);
    setBlockOrders(enrichedBlockOrders);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleRefresh = () => {
    if (selectedClient) loadClientData(selectedClient);
    toast.success("Dados atualizados!");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <ThumbsUp className="w-4 h-4 text-green-400" />;
      case "rejected": return <ThumbsDown className="w-4 h-4 text-red-400" />;
      default: return <MinusCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved": return "Aprovada";
      case "rejected": return "Rejeitada";
      default: return "Pendente";
    }
  };

  const stats = {
    approved: preferences.filter(p => p.status === "approved").length,
    rejected: preferences.filter(p => p.status === "rejected").length,
    pending: preferences.filter(p => p.status === "pending").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const selectedClientName = clients.find(c => c.id === selectedClient)?.client_name || "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold">Home Music — Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Client selector */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-2 block">Cliente</label>
          <select
            value={selectedClient || ""}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full max-w-xs bg-card border border-border rounded-lg px-3 py-2 text-foreground"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.client_name}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Total de respostas</p>
            <p className="text-2xl font-bold">{preferences.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-green-400">Aprovadas</p>
            <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-red-400">Rejeitadas</p>
            <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Sugestões</p>
            <p className="text-2xl font-bold">{suggestions.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: "preferences" as const, label: "Curadoria", icon: Music, count: preferences.length },
            { key: "suggestions" as const, label: "Sugestões", icon: MessageCircle, count: suggestions.length },
            { key: "links" as const, label: "Links DJ", icon: Link2, count: djLinks.length },
            { key: "blocks" as const, label: "Ordem Blocos", icon: ArrowUpDown, count: blockOrders.length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-primary-foreground/20" : "bg-muted"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "preferences" && (
          <div className="space-y-2">
            {preferences.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">Nenhuma curadoria realizada ainda.</p>
            ) : (
              preferences.map(p => (
                <div key={p.id} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(p.status)}
                    <div>
                      <p className="font-medium text-sm">{p.song_title}</p>
                      <p className="text-xs text-muted-foreground">{p.song_artist} — {p.block_name}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    p.status === "approved" ? "bg-green-500/10 text-green-400" :
                    p.status === "rejected" ? "bg-red-500/10 text-red-400" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {getStatusLabel(p.status)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "suggestions" && (
          <div className="space-y-2">
            {suggestions.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">Nenhuma sugestão enviada.</p>
            ) : (
              suggestions.map(s => (
                <div key={s.id} className="bg-card border border-border rounded-xl px-4 py-3">
                  <p className="font-medium text-sm">{s.title}</p>
                  {s.artist && <p className="text-xs text-muted-foreground">{s.artist}</p>}
                  {s.notes && <p className="text-xs text-muted-foreground mt-1 italic">"{s.notes}"</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(s.created_at!).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "links" && (
          <div className="space-y-2">
            {djLinks.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">Nenhum link enviado.</p>
            ) : (
              djLinks.map(l => (
                <div key={l.id} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    {l.name && <p className="font-medium text-sm">{l.name}</p>}
                    <a href={l.spotify_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">
                      {l.spotify_url}
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {new Date(l.created_at!).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "blocks" && (
          <div className="space-y-2">
            {blockOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">Nenhuma reordenação de blocos.</p>
            ) : (
              blockOrders.map((bo, i) => (
                <div key={bo.id} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-lg font-bold text-primary">{i + 1}</span>
                  <p className="font-medium text-sm">{bo.block_name}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
