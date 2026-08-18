import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatBRL } from "@/data/regionPricing";

interface SplitRow { name: string; role: string; amount: number }

const ProposalInternalContract = ({ proposalId, contractValue }: { proposalId: string; contractValue: number }) => {
  const [form, setForm] = useState({ closed_by: "", executed_by: "", technical_lead: "", terms: "" });
  const [split, setSplit] = useState<SplitRow[]>([]);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [proposalId]);

  const load = async () => {
    const { data } = await supabase.from("proposal_internal_contracts").select("*").eq("proposal_id", proposalId).maybeSingle();
    if (data) {
      setExistingId(data.id);
      setForm({
        closed_by: data.closed_by || "", executed_by: data.executed_by || "",
        technical_lead: data.technical_lead || "", terms: data.terms || "",
      });
      setSplit(((data.revenue_split as any) || []) as SplitRow[]);
    }
  };

  const save = async () => {
    setSaving(true);
    const payload = { ...form, revenue_split: split as any, proposal_id: proposalId, updated_at: new Date().toISOString() };
    const { error } = existingId
      ? await supabase.from("proposal_internal_contracts").update(payload).eq("id", existingId)
      : await supabase.from("proposal_internal_contracts").insert(payload);
    setSaving(false);
    if (error) { toast.error("Erro ao salvar contrato interno"); return; }
    toast.success("Contrato interno salvo!");
    load();
  };

  const totalSplit = split.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const remaining = contractValue - totalSplit;

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
        <h3 className="font-semibold text-sm">Contrato Interno</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div><Label className="text-xs">Fechado por</Label><Input value={form.closed_by} onChange={e => setForm(f => ({ ...f, closed_by: e.target.value }))} /></div>
          <div><Label className="text-xs">Executado por</Label><Input value={form.executed_by} onChange={e => setForm(f => ({ ...f, executed_by: e.target.value }))} /></div>
          <div><Label className="text-xs">Responsável técnico</Label><Input value={form.technical_lead} onChange={e => setForm(f => ({ ...f, technical_lead: e.target.value }))} /></div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Divisão de valores</Label>
          {split.map((r, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <Input value={r.name} onChange={e => setSplit(s => s.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} className="h-8 col-span-5 text-xs" placeholder="Nome" />
              <Input value={r.role} onChange={e => setSplit(s => s.map((x, j) => j === i ? { ...x, role: e.target.value } : x))} className="h-8 col-span-4 text-xs" placeholder="Função" />
              <Input type="number" value={r.amount} onChange={e => setSplit(s => s.map((x, j) => j === i ? { ...x, amount: Number(e.target.value) } : x))} className="h-8 col-span-2 text-xs" placeholder="Valor" />
              <Button variant="ghost" size="icon" className="h-7 w-7 col-span-1" onClick={() => setSplit(s => s.filter((_, j) => j !== i))}><Trash2 className="w-3 h-3 text-destructive" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setSplit([...split, { name: "", role: "", amount: 0 }])}>
            <Plus className="w-3.5 h-3.5" /> Adicionar pessoa
          </Button>
          <div className="flex flex-wrap gap-4 text-xs pt-2">
            <span className="text-muted-foreground">Contrato: <strong className="text-foreground">{formatBRL(contractValue)}</strong></span>
            <span className="text-muted-foreground">Repasses: <strong className="text-foreground">{formatBRL(totalSplit)}</strong></span>
            <span className="text-muted-foreground">Saldo: <strong className={remaining >= 0 ? "text-primary" : "text-destructive"}>{formatBRL(remaining)}</strong></span>
          </div>
        </div>

        <div><Label className="text-xs">Termos / observações internas</Label><Textarea rows={4} value={form.terms} onChange={e => setForm(f => ({ ...f, terms: e.target.value }))} /></div>
        <Button onClick={save} disabled={saving} className="gap-2"><Save className="w-4 h-4" />{saving ? "Salvando..." : "Salvar contrato interno"}</Button>
      </div>
    </div>
  );
};

export default ProposalInternalContract;
