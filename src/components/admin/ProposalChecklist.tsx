import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CHECKLIST_CATEGORIES } from "@/data/regionPricing";

const STATUSES = [
  { value: "pending", label: "Pendente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "rented", label: "Locado" },
  { value: "na", label: "Não se aplica" },
];

const ProposalChecklist = ({ proposalId }: { proposalId: string }) => {
  const [rows, setRows] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [proposalId]);

  const load = async () => {
    const { data } = await supabase.from("proposal_checklist").select("*").eq("proposal_id", proposalId).order("display_order");
    setRows(data || []);
  };

  const add = async () => {
    const { data, error } = await supabase.from("proposal_checklist").insert({
      proposal_id: proposalId, item: "Novo item", category: "tecnico", display_order: rows.length,
    }).select().single();
    if (error) { toast.error("Erro ao adicionar"); return; }
    setRows([...rows, data]);
  };

  const update = (id: string, patch: Record<string, any>) =>
    setRows(rs => rs.map(r => (r.id === id ? { ...r, ...patch } : r)));

  const remove = async (id: string) => {
    await supabase.from("proposal_checklist").delete().eq("id", id);
    setRows(rs => rs.filter(r => r.id !== id));
  };

  const save = async () => {
    setSaving(true);
    const results = await Promise.all(rows.map((r, idx) =>
      supabase.from("proposal_checklist").update({
        item: r.item, category: r.category, quantity: Number(r.quantity) || 1,
        status: r.status, notes: r.notes, display_order: idx,
      }).eq("id", r.id)));
    setSaving(false);
    if (results.some(r => r.error)) { toast.error("Erro ao salvar"); return; }
    toast.success("Checklist salvo!");
  };

  const byStatus = (s: string) => rows.filter(r => r.status === s).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="text-muted-foreground">Total: <strong className="text-foreground">{rows.length}</strong></span>
        <span className="text-muted-foreground">Confirmados: <strong className="text-primary">{byStatus("confirmed")}</strong></span>
        <span className="text-muted-foreground">Pendentes: <strong className="text-foreground">{byStatus("pending")}</strong></span>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        {rows.length === 0 && <p className="text-xs text-muted-foreground py-4 text-center">Nenhum item no checklist ainda.</p>}
        {rows.map(r => (
          <div key={r.id} className="grid grid-cols-12 gap-2 items-center">
            <Input value={r.item} onChange={e => update(r.id, { item: e.target.value })} className="h-8 col-span-12 sm:col-span-4 text-xs" placeholder="Item" />
            <select value={r.category} onChange={e => update(r.id, { category: e.target.value })} className="h-8 col-span-5 sm:col-span-2 rounded-md border border-input bg-background px-1 text-xs">
              {CHECKLIST_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <Input type="number" value={r.quantity} onChange={e => update(r.id, { quantity: e.target.value })} className="h-8 col-span-2 sm:col-span-1 text-xs" />
            <select value={r.status} onChange={e => update(r.id, { status: e.target.value })} className="h-8 col-span-4 sm:col-span-2 rounded-md border border-input bg-background px-1 text-xs">
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <Input value={r.notes || ""} onChange={e => update(r.id, { notes: e.target.value })} className="h-8 col-span-11 sm:col-span-2 text-xs" placeholder="Obs." />
            <Button variant="ghost" size="icon" className="h-7 w-7 col-span-1" onClick={() => remove(r.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={add} className="gap-1.5"><Plus className="w-3.5 h-3.5" /> Adicionar item</Button>
          <Button size="sm" onClick={save} disabled={saving} className="gap-1.5"><Save className="w-3.5 h-3.5" /> {saving ? "Salvando..." : "Salvar checklist"}</Button>
        </div>
      </div>
      <Label className="text-[11px] text-muted-foreground">Checklist interno — não aparece para o cliente.</Label>
    </div>
  );
};

export default ProposalChecklist;
