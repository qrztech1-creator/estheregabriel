import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  proposalId: string;
  onBack: () => void;
}

const actionLabels: Record<string, string> = {
  accepted: "Proposta aceita",
  updated_details: "Dados atualizados",
  uploaded_contract: "Contrato anexado",
  uploaded_receipt: "Comprovante anexado",
  removed_receipt: "Comprovante removido",
  edited_proposal: "Proposta editada",
};

const ProposalHistory = ({ proposalId, onBack }: Props) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposalName, setProposalName] = useState("");

  useEffect(() => {
    loadData();
  }, [proposalId]);

  const loadData = async () => {
    const [{ data: logsData }, { data: proposal }] = await Promise.all([
      supabase.from("proposal_audit_log" as any).select("*").eq("proposal_id", proposalId).order("created_at", { ascending: false }),
      supabase.from("proposals").select("bride_name, groom_name").eq("id", proposalId).maybeSingle(),
    ]);
    setLogs(logsData || []);
    if (proposal) setProposalName(`${proposal.bride_name} & ${proposal.groom_name}`);
    setLoading(false);
  };

  const renderChanges = (changes: any) => {
    if (!changes || typeof changes !== "object") return null;
    return (
      <div className="mt-2 space-y-1">
        {Object.entries(changes).map(([key, val]: [string, any]) => {
          if (val && typeof val === "object" && "from" in val) {
            return (
              <div key={key} className="text-xs">
                <span className="text-muted-foreground">{key}:</span>{" "}
                <span className="line-through text-destructive/70">{String(val.from || "—")}</span>{" → "}
                <span className="text-primary">{String(val.to || "—")}</span>
              </div>
            );
          }
          return (
            <div key={key} className="text-xs">
              <span className="text-muted-foreground">{key}:</span>{" "}
              <span>{Array.isArray(val) ? val.join(", ") : String(val ?? "—")}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-4 h-4" /></Button>
        <div>
          <h2 className="text-lg sm:text-xl font-bold">Histórico de Alterações</h2>
          <p className="text-xs text-muted-foreground">{proposalName}</p>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nenhuma alteração registrada ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log: any) => (
            <div key={log.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${log.actor_type === "client" ? "bg-blue-500/20 text-blue-400" : "bg-primary/20 text-primary"}`}>
                  {log.actor_type === "client" ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{actionLabels[log.action] || log.action}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${log.actor_type === "client" ? "bg-blue-500/20 text-blue-400" : "bg-primary/20 text-primary"}`}>
                      {log.actor_type === "client" ? "Cliente" : "Admin"}
                    </span>
                  </div>
                  {log.actor_name && <p className="text-xs text-muted-foreground mt-0.5">{log.actor_name}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(log.created_at).toLocaleString("pt-BR")}</p>
                  {renderChanges(log.changes)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalHistory;
