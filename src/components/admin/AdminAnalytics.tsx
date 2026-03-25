import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Users, FileText, TrendingUp, Eye, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  onViewProposal: (id: string) => void;
}

const statusLabels: Record<string, string> = {
  proposal_sent: "Proposta Enviada",
  viewed: "Visualizada",
  negotiating: "Em Negociação",
  accepted: "Aceita",
  contract_signed: "Contrato Assinado",
  rejected: "Recusada",
  active: "Ativa",
};

const statusColors: Record<string, string> = {
  proposal_sent: "bg-blue-500/10 text-blue-400",
  viewed: "bg-yellow-500/10 text-yellow-400",
  negotiating: "bg-purple-500/10 text-purple-400",
  accepted: "bg-green-500/10 text-green-400",
  contract_signed: "bg-emerald-500/10 text-emerald-400",
  rejected: "bg-red-500/10 text-red-400",
  active: "bg-green-500/10 text-green-400",
};

const AdminAnalytics = ({ onViewProposal }: Props) => {
  const [proposals, setProposals] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [propRes, prefsRes, sugRes] = await Promise.all([
      supabase.from("proposals").select("*").order("created_at", { ascending: false }),
      supabase.from("song_preferences").select("*"),
      supabase.from("song_suggestions").select("*"),
    ]);
    setProposals(propRes.data || []);
    setPreferences(prefsRes.data || []);
    setSuggestions(sugRes.data || []);
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  const totalValue = proposals.reduce((sum, p) => sum + (Number(p.contract_value) || 0), 0);
  const totalPrefs = preferences.length;
  const approvedPrefs = preferences.filter(p => p.status === "approved").length;
  const rejectedPrefs = preferences.filter(p => p.status === "rejected").length;

  const stats = [
    { label: "Propostas", value: proposals.length, icon: FileText, color: "text-blue-400" },
    { label: "Valor Total", value: `R$ ${totalValue.toLocaleString("pt-BR")}`, icon: TrendingUp, color: "text-emerald-400" },
    { label: "Curadorias", value: totalPrefs, icon: Users, color: "text-purple-400" },
    { label: "Sugestões", value: suggestions.length, icon: BarChart3, color: "text-yellow-400" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs sm:text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Curadoria Overview */}
      {totalPrefs > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <h3 className="font-semibold text-sm mb-3">Curadoria Geral</h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-muted-foreground">Aprovadas:</span>
              <span className="font-bold text-green-400">{approvedPrefs}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-muted-foreground">Rejeitadas:</span>
              <span className="font-bold text-red-400">{rejectedPrefs}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Pendentes:</span>
              <span className="font-bold">{totalPrefs - approvedPrefs - rejectedPrefs}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden flex">
            {approvedPrefs > 0 && <div className="bg-green-500 h-full" style={{ width: `${(approvedPrefs / totalPrefs) * 100}%` }} />}
            {rejectedPrefs > 0 && <div className="bg-red-500 h-full" style={{ width: `${(rejectedPrefs / totalPrefs) * 100}%` }} />}
          </div>
        </div>
      )}

      {/* Pipeline / Proposals list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border">
          <h3 className="font-semibold text-sm">Pipeline de Propostas</h3>
        </div>
        <div className="divide-y divide-border">
          {proposals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">Nenhuma proposta ainda.</p>
          ) : proposals.map((p: any) => (
            <button
              key={p.id}
              onClick={() => onViewProposal(p.id)}
              className="w-full text-left px-4 sm:px-5 py-3 sm:py-4 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{p.bride_name} & {p.groom_name}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{new Date(p.event_date).toLocaleDateString("pt-BR")}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="truncate">{p.venue_name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {p.contract_value > 0 && (
                    <span className="text-xs font-medium text-emerald-400">
                      R$ {Number(p.contract_value).toLocaleString("pt-BR")}
                    </span>
                  )}
                  {p.view_count > 0 && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="w-3 h-3" />{p.view_count}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${statusColors[p.contract_status] || statusColors[p.status] || "bg-muted text-muted-foreground"}`}>
                    {statusLabels[p.contract_status] || statusLabels[p.status] || p.contract_status || p.status}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
