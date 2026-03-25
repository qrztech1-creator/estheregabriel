import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Music, ThumbsUp, ThumbsDown, MinusCircle, MessageCircle, Link2, ArrowUpDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  proposalId: string;
  onBack: () => void;
}

const ProposalResponses = ({ proposalId, onBack }: Props) => {
  const [proposal, setProposal] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [djLinks, setDjLinks] = useState<any[]>([]);
  const [blockOrders, setBlockOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"preferences" | "suggestions" | "links" | "blocks">("preferences");

  useEffect(() => { loadProposal(); }, [proposalId]);
  useEffect(() => { if (selectedClient) loadClientData(selectedClient); }, [selectedClient]);

  const loadProposal = async () => {
    const { data: prop } = await supabase.from("proposals").select("*").eq("id", proposalId).single();
    setProposal(prop);
    const { data: tokens } = await (supabase.from("client_tokens") as any).select("*").eq("proposal_id", proposalId);
    setClients(tokens || []);
    if (tokens?.length) setSelectedClient(tokens[0].id);
  };

  const loadClientData = async (clientId: string) => {
    const [prefsRes, suggestionsRes, linksRes, blockOrderRes, songsRes, blocksRes] = await Promise.all([
      supabase.from("song_preferences").select("*").eq("client_token_id", clientId).order("updated_at", { ascending: false }),
      supabase.from("song_suggestions").select("*").eq("client_token_id", clientId).order("created_at", { ascending: false }),
      supabase.from("dj_playlist_links").select("*").eq("client_token_id", clientId).order("created_at", { ascending: false }),
      supabase.from("block_order_preferences").select("*").eq("client_token_id", clientId).order("display_order"),
      supabase.from("playlist_songs").select("*"),
      supabase.from("playlist_blocks").select("*"),
    ]);

    const songsMap = new Map((songsRes.data || []).map((s: any) => [s.id, s]));
    const blocksMap = new Map((blocksRes.data || []).map((b: any) => [b.id, b]));

    setPreferences((prefsRes.data || []).map((p: any) => {
      const song = songsMap.get(p.song_id);
      const block = song ? blocksMap.get(song.block_id) : null;
      return { ...p, song_title: song?.title || "Desconhecida", song_artist: song?.artist || "", block_name: block?.name || "" };
    }));
    setSuggestions(suggestionsRes.data || []);
    setDjLinks(linksRes.data || []);
    setBlockOrders((blockOrderRes.data || []).map((bo: any) => ({ ...bo, block_name: blocksMap.get(bo.block_id)?.name || "Desconhecido" })));
  };

  const refresh = () => { if (selectedClient) loadClientData(selectedClient); toast.success("Atualizado!"); };
  const getStatusIcon = (s: string) => s === "approved" ? <ThumbsUp className="w-4 h-4 text-green-400" /> : s === "rejected" ? <ThumbsDown className="w-4 h-4 text-red-400" /> : <MinusCircle className="w-4 h-4 text-muted-foreground" />;
  const getStatusLabel = (s: string) => s === "approved" ? "Aprovada" : s === "rejected" ? "Rejeitada" : "Pendente";

  const stats = {
    approved: preferences.filter(p => p.status === "approved").length,
    rejected: preferences.filter(p => p.status === "rejected").length,
    pending: preferences.filter(p => p.status === "pending").length,
  };

  if (!proposal) return <div className="text-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" /> Voltar</Button>
        <h2 className="text-xl font-semibold">{(proposal as any).bride_name} & {(proposal as any).groom_name}</h2>
        <Button variant="ghost" size="icon" onClick={refresh}><RefreshCw className="w-4 h-4" /></Button>
      </div>

      {clients.length > 1 && (
        <select value={selectedClient || ""} onChange={e => setSelectedClient(e.target.value)} className="w-full max-w-xs bg-card border border-border rounded-lg px-3 py-2 text-foreground mb-4">
          {clients.map((c: any) => <option key={c.id} value={c.id}>{c.client_name}</option>)}
        </select>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-3 sm:p-4"><p className="text-xs sm:text-sm text-muted-foreground">Total</p><p className="text-xl sm:text-2xl font-bold">{preferences.length}</p></div>
        <div className="bg-card border border-border rounded-xl p-3 sm:p-4"><p className="text-xs sm:text-sm text-green-400">Aprovadas</p><p className="text-xl sm:text-2xl font-bold text-green-400">{stats.approved}</p></div>
        <div className="bg-card border border-border rounded-xl p-3 sm:p-4"><p className="text-xs sm:text-sm text-red-400">Rejeitadas</p><p className="text-xl sm:text-2xl font-bold text-red-400">{stats.rejected}</p></div>
        <div className="bg-card border border-border rounded-xl p-3 sm:p-4"><p className="text-xs sm:text-sm text-muted-foreground">Sugestões</p><p className="text-xl sm:text-2xl font-bold">{suggestions.length}</p></div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
        {([
          { key: "preferences" as const, label: "Curadoria", icon: Music, count: preferences.length },
          { key: "suggestions" as const, label: "Sugestões", icon: MessageCircle, count: suggestions.length },
          { key: "links" as const, label: "Links DJ", icon: Link2, count: djLinks.length },
          { key: "blocks" as const, label: "Ordem", icon: ArrowUpDown, count: blockOrders.length },
        ]).map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.key ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
            <tab.icon className="w-3.5 h-3.5" />{tab.label}{tab.count > 0 && <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted">{tab.count}</span>}
          </button>
        ))}
      </div>

      {activeTab === "preferences" && (
        <div className="space-y-2">
          {preferences.length === 0 ? <p className="text-muted-foreground text-center py-12">Nenhuma curadoria ainda.</p> :
            preferences.map((p: any) => (
              <div key={p.id} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">{getStatusIcon(p.status)}<div><p className="font-medium text-sm">{p.song_title}</p><p className="text-xs text-muted-foreground">{p.song_artist} — {p.block_name}</p></div></div>
                <span className={`text-xs px-2 py-1 rounded-full ${p.status === "approved" ? "bg-green-500/10 text-green-400" : p.status === "rejected" ? "bg-red-500/10 text-red-400" : "bg-muted text-muted-foreground"}`}>{getStatusLabel(p.status)}</span>
              </div>
            ))}
        </div>
      )}

      {activeTab === "suggestions" && (
        <div className="space-y-2">
          {suggestions.length === 0 ? <p className="text-muted-foreground text-center py-12">Nenhuma sugestão.</p> :
            suggestions.map((s: any) => (
              <div key={s.id} className="bg-card border border-border rounded-xl px-4 py-3">
                <p className="font-medium text-sm">{s.title}</p>
                {s.artist && <p className="text-xs text-muted-foreground">{s.artist}</p>}
                {s.notes && <p className="text-xs text-muted-foreground mt-1 italic">"{s.notes}"</p>}
              </div>
            ))}
        </div>
      )}

      {activeTab === "links" && (
        <div className="space-y-2">
          {djLinks.length === 0 ? <p className="text-muted-foreground text-center py-12">Nenhum link.</p> :
            djLinks.map((l: any) => (
              <div key={l.id} className="bg-card border border-border rounded-xl px-4 py-3">
                {l.name && <p className="font-medium text-sm">{l.name}</p>}
                <a href={l.spotify_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">{l.spotify_url}</a>
              </div>
            ))}
        </div>
      )}

      {activeTab === "blocks" && (
        <div className="space-y-2">
          {blockOrders.length === 0 ? <p className="text-muted-foreground text-center py-12">Nenhuma reordenação.</p> :
            blockOrders.map((bo: any, i: number) => (
              <div key={bo.id} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-lg font-bold text-primary">{i + 1}</span>
                <p className="font-medium text-sm">{bo.block_name}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProposalResponses;
