import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, ExternalLink, Copy, Calendar, RefreshCw, Pencil, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  onDetail?: (id: string) => void;
}

const ProposalList = ({ onView, onEdit, onDetail }: Props) => {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("proposals").select("*").order("created_at", { ascending: false });
    setProposals(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/proposta/${slug}`);
    toast.success("Link copiado!");
  };

  const statusLabels: Record<string, { label: string; className: string }> = {
    proposal_sent: { label: "Enviada", className: "bg-blue-500/10 text-blue-400" },
    viewed: { label: "Visualizada", className: "bg-yellow-500/10 text-yellow-400" },
    negotiating: { label: "Negociando", className: "bg-orange-500/10 text-orange-400" },
    accepted: { label: "Aceita", className: "bg-green-500/10 text-green-400" },
    contract_signed: { label: "Assinado", className: "bg-primary/10 text-primary" },
    rejected: { label: "Recusada", className: "bg-destructive/10 text-destructive" },
  };

  if (loading) return <div className="text-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Propostas</h2>
        <Button variant="ghost" size="sm" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
      </div>
      {proposals.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Nenhuma proposta criada ainda.</p>
      ) : (
        <div className="space-y-3">
          {proposals.map((p: any) => {
            const status = statusLabels[p.contract_status] || statusLabels.proposal_sent;
            return (
              <div key={p.id} className="bg-card border border-border rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-sm sm:text-base truncate">{p.bride_name} & {p.groom_name}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(p.event_date).toLocaleDateString("pt-BR")}</span>
                    <span className="truncate">{p.venue_name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${status.className}`}>{status.label}</span>
                    {p.created_by && <span className="text-[10px] text-muted-foreground">Consultor: {p.created_by}</span>}
                    {p.accepted_at && <span className="text-[10px] text-green-400">✓ Aceita</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyLink(p.slug)} title="Copiar link"><Copy className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild><a href={`/proposta/${p.slug}`} target="_blank"><ExternalLink className="w-3.5 h-3.5" /></a></Button>
                  {onEdit && <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={() => onEdit(p.id)}><Pencil className="w-3 h-3" /> Editar</Button>}
                  {onDetail && <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={() => onDetail(p.id)}><Info className="w-3 h-3" /> CRM</Button>}
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => onView(p.id)}><Eye className="w-3.5 h-3.5" /> Respostas</Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProposalList;
