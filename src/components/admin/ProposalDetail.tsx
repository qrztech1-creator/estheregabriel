import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Save, ExternalLink, Copy, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  proposalId: string;
  onBack: () => void;
}

const contractStatuses = [
  { value: "proposal_sent", label: "Proposta Enviada" },
  { value: "viewed", label: "Visualizada" },
  { value: "negotiating", label: "Em Negociação" },
  { value: "accepted", label: "Aceita" },
  { value: "contract_signed", label: "Contrato Assinado" },
  { value: "rejected", label: "Recusada" },
];

const ProposalDetail = ({ proposalId, onBack }: Props) => {
  const [proposal, setProposal] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    client_email: "", client_phone: "", client_instagram: "",
    contract_value: 0, contract_status: "proposal_sent", notes: "",
  });

  useEffect(() => { loadProposal(); }, [proposalId]);

  const loadProposal = async () => {
    const { data } = await supabase.from("proposals").select("*").eq("id", proposalId).maybeSingle();
    if (data) {
      setProposal(data);
      const d = data as any;
      setForm({
        client_email: d.client_email || "", client_phone: d.client_phone || "",
        client_instagram: d.client_instagram || "", contract_value: Number(d.contract_value) || 0,
        contract_status: d.contract_status || "proposal_sent", notes: d.notes || "",
      });
    }
  };

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("proposals").update({
      client_email: form.client_email || null, client_phone: form.client_phone || null,
      client_instagram: form.client_instagram || null, contract_value: form.contract_value || 0,
      contract_status: form.contract_status, notes: form.notes || null,
    }).eq("id", proposalId);
    if (error) toast.error("Erro ao salvar");
    else toast.success("Salvo com sucesso!");
    setSaving(false);
  };

  const copyLink = () => {
    if (proposal) {
      navigator.clipboard.writeText(`${window.location.origin}/proposta/${proposal.slug}`);
      toast.success("Link copiado!");
    }
  };

  if (!proposal) return <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  const accepted = proposal.accepted_at;
  const acceptedPlan = proposal.accepted_plan;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-4 h-4" /></Button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">{proposal.bride_name} & {proposal.groom_name}</h2>
            <p className="text-xs text-muted-foreground">{new Date(proposal.event_date).toLocaleDateString("pt-BR")} — {proposal.venue_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5"><Copy className="w-3.5 h-3.5" /> Link</Button>
          <Button variant="outline" size="sm" asChild><a href={`/proposta/${proposal.slug}`} target="_blank"><ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Abrir</a></Button>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
          <p className="text-xs text-muted-foreground mb-1">Convidados</p>
          <p className="text-lg font-bold">{proposal.guest_count}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
          <p className="text-xs text-muted-foreground mb-1">Visualizações</p>
          <p className="text-lg font-bold">{proposal.view_count || 0}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
          <p className="text-xs text-muted-foreground mb-1">Horário</p>
          <p className="text-lg font-bold">{proposal.event_start_time} - {proposal.event_end_time}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
          <p className="text-xs text-muted-foreground mb-1">Atendente</p>
          <p className="text-lg font-bold">{proposal.created_by || "—"}</p>
        </div>
      </div>

      {/* Accepted info */}
      {accepted && (
        <div className="bg-green-500/5 border border-green-500/30 rounded-xl p-4 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-green-400">
            <Check className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Proposta Aceita pelo Cliente</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Data:</span> <strong>{new Date(accepted).toLocaleString("pt-BR")}</strong></div>
            {acceptedPlan && (
              <>
                <div><span className="text-muted-foreground">Pacote:</span> <strong>{acceptedPlan.label}</strong></div>
                <div><span className="text-muted-foreground">Valor:</span> <strong>R$ {(acceptedPlan.total || 0).toLocaleString("pt-BR")}</strong></div>
                <div><span className="text-muted-foreground">Pagamento:</span> <strong>{acceptedPlan.payment_method || proposal.accepted_payment_method}</strong></div>
              </>
            )}
            {proposal.accepted_notes && (
              <div className="col-span-2"><span className="text-muted-foreground">Obs do cliente:</span> <strong>{proposal.accepted_notes}</strong></div>
            )}
          </div>
        </div>
      )}

      {/* CRM Section */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
        <h3 className="font-semibold text-sm flex items-center gap-2"><MessageCircle className="w-4 h-4 text-primary" /> Dados do Cliente & Contrato</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label className="text-xs">Email</Label><Input value={form.client_email} onChange={e => setForm(f => ({ ...f, client_email: e.target.value }))} placeholder="email@exemplo.com" /></div>
          <div><Label className="text-xs">Telefone</Label><Input value={form.client_phone} onChange={e => setForm(f => ({ ...f, client_phone: e.target.value }))} placeholder="(27) 99999-9999" /></div>
          <div><Label className="text-xs">Instagram</Label><Input value={form.client_instagram} onChange={e => setForm(f => ({ ...f, client_instagram: e.target.value }))} placeholder="@instagram" /></div>
          <div><Label className="text-xs">Valor do Contrato (R$)</Label><Input type="number" value={form.contract_value} onChange={e => setForm(f => ({ ...f, contract_value: Number(e.target.value) }))} /></div>
          <div>
            <Label className="text-xs">Status do Contrato</Label>
            <select value={form.contract_status} onChange={e => setForm(f => ({ ...f, contract_status: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
              {contractStatuses.map(s => (<option key={s.value} value={s.value}>{s.label}</option>))}
            </select>
          </div>
        </div>
        <div><Label className="text-xs">Anotações</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observações..." rows={4} /></div>
        <Button onClick={save} disabled={saving} className="w-full sm:w-auto gap-2"><Save className="w-4 h-4" />{saving ? "Salvando..." : "Salvar Alterações"}</Button>
      </div>
    </div>
  );
};

export default ProposalDetail;
