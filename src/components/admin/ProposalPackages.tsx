import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Save, ChevronDown, ChevronRight, Gift, Wand2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import AiTextButton from "./AiTextButton";
import { getPackagePresets, presetTotals, type PackagePreset } from "@/data/packagePresets";
import {
  ITEM_CATEGORIES, PACKAGE_CATEGORIES, PRICE_BANDS, REGIONS, formatBRL, type RegionKey,
} from "@/data/regionPricing";


interface Props {
  proposalId: string;
  proposalLabel: string;
  region: RegionKey;
  onRegionChange: (r: RegionKey) => void;
}

type Pkg = any;
type Item = any;

const ProposalPackages = ({ proposalId, proposalLabel, region, onRegionChange }: Props) => {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [presetOpen, setPresetOpen] = useState(false);
  const presets = useMemo(() => getPackagePresets(region), [region]);

  const addPreset = async (preset: PackagePreset) => {
    const { data: pkg, error } = await supabase.from("proposal_packages").insert({
      proposal_id: proposalId, name: preset.name, description: preset.description,
      category: preset.category, sale_price: presetTotals(preset).price,
      is_optional: !!preset.is_optional, display_order: packages.length,
    }).select().single();
    if (error || !pkg) { toast.error("Erro ao adicionar sugestão"); return; }
    const { data: its } = await supabase.from("proposal_package_items").insert(
      preset.items.map((i, idx) => ({
        proposal_id: proposalId, package_id: pkg.id, name: i.name, category: i.category,
        quantity: i.quantity, unit_cost: i.unit_cost, unit_price: i.unit_price,
        is_optional: !!preset.is_optional, display_order: items.length + idx,
      }))).select();
    setPackages(ps => [...ps, pkg]);
    setItems(is => [...is, ...(its || [])]);
    setOpen(o => ({ ...o, [pkg.id]: true }));
    setPresetOpen(false);
    toast.success("Sugestão adicionada — edite à vontade");
  };


  useEffect(() => { load(); }, [proposalId]);

  const load = async () => {
    const [{ data: pkgs }, { data: its }] = await Promise.all([
      supabase.from("proposal_packages").select("*").eq("proposal_id", proposalId).order("display_order"),
      supabase.from("proposal_package_items").select("*").eq("proposal_id", proposalId).order("display_order"),
    ]);
    setPackages(pkgs || []);
    setItems(its || []);
  };

  const addPackage = async () => {
    const { data, error } = await supabase.from("proposal_packages").insert({
      proposal_id: proposalId, name: "Novo pacote", category: "festa",
      display_order: packages.length,
    }).select().single();
    if (error) { toast.error("Erro ao criar pacote"); return; }
    setPackages([...packages, data]);
    setOpen(o => ({ ...o, [data.id]: true }));
  };

  const updatePackage = (id: string, patch: Record<string, any>) =>
    setPackages(ps => ps.map(p => (p.id === id ? { ...p, ...patch } : p)));

  const removePackage = async (id: string) => {
    await supabase.from("proposal_packages").delete().eq("id", id);
    setPackages(ps => ps.filter(p => p.id !== id));
    setItems(is => is.filter(i => i.package_id !== id));
  };

  const addItem = async (packageId: string | null) => {
    const { data, error } = await supabase.from("proposal_package_items").insert({
      proposal_id: proposalId, package_id: packageId, name: "Novo item",
      category: "artista", display_order: items.length,
    }).select().single();
    if (error) { toast.error("Erro ao criar item"); return; }
    setItems([...items, data]);
  };

  const updateItem = (id: string, patch: Record<string, any>) =>
    setItems(is => is.map(i => (i.id === id ? { ...i, ...patch } : i)));

  const removeItem = async (id: string) => {
    await supabase.from("proposal_package_items").delete().eq("id", id);
    setItems(is => is.filter(i => i.id !== id));
  };

  const saveAll = async () => {
    setSaving(true);
    const pkgOps = packages.map((p, idx) =>
      supabase.from("proposal_packages").update({
        name: p.name, description: p.description, category: p.category,
        sale_price: Number(p.sale_price) || 0, internal_cost: Number(p.internal_cost) || 0,
        is_optional: !!p.is_optional, is_courtesy: !!p.is_courtesy, recommended: !!p.recommended,
        display_order: idx,
      }).eq("id", p.id));
    const itemOps = items.map((i, idx) =>
      supabase.from("proposal_package_items").update({
        name: i.name, description: i.description, category: i.category,
        quantity: Number(i.quantity) || 1, unit_cost: Number(i.unit_cost) || 0,
        unit_price: Number(i.unit_price) || 0, is_courtesy: !!i.is_courtesy, is_optional: !!i.is_optional,
        display_order: idx,
      }).eq("id", i.id));
    const results = await Promise.all([...pkgOps, ...itemOps]);
    setSaving(false);
    if (results.some(r => r.error)) { toast.error("Erro ao salvar"); return; }
    await supabase.from("proposal_audit_log").insert({
      proposal_id: proposalId, actor_type: "admin", action: "edited_proposal",
      changes: { secao: "pacotes e custos" },
    });
    toast.success("Pacotes salvos!");
    load();
  };

  const itemsOf = (pkgId: string | null) => items.filter(i => (i.package_id || null) === pkgId);

  const pkgItemsCost = (pkgId: string) =>
    itemsOf(pkgId).reduce((s, i) => s + (Number(i.unit_cost) || 0) * (Number(i.quantity) || 1), 0);
  const pkgItemsPrice = (pkgId: string) =>
    itemsOf(pkgId).reduce((s, i) => s + (i.is_courtesy ? 0 : (Number(i.unit_price) || 0) * (Number(i.quantity) || 1)), 0);

  const pkgCost = (p: Pkg) => (Number(p.internal_cost) || 0) + pkgItemsCost(p.id);
  const pkgPrice = (p: Pkg) => (p.is_courtesy ? 0 : Number(p.sale_price) || 0);

  const totalCost = packages.reduce((s, p) => s + pkgCost(p), 0)
    + itemsOf(null).reduce((s, i) => s + (Number(i.unit_cost) || 0) * (Number(i.quantity) || 1), 0);
  const totalPrice = packages.filter(p => !p.is_optional).reduce((s, p) => s + pkgPrice(p), 0);
  const margin = totalPrice - totalCost;
  const marginPct = totalPrice > 0 ? (margin / totalPrice) * 100 : 0;

  return (
    <div className="space-y-5">
      {/* Region + margin summary */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <Label className="text-xs">Região do evento</Label>
            <select value={region} onChange={e => onRegionChange(e.target.value as RegionKey)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              {REGIONS.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3 flex-1">
            <div><p className="text-[10px] text-muted-foreground uppercase">Custo interno</p><p className="text-sm font-bold">{formatBRL(totalCost)}</p></div>
            <div><p className="text-[10px] text-muted-foreground uppercase">Venda (fixos)</p><p className="text-sm font-bold">{formatBRL(totalPrice)}</p></div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Margem</p>
              <p className={`text-sm font-bold ${margin >= 0 ? "text-primary" : "text-destructive"}`}>
                {formatBRL(margin)} <span className="text-[10px]">({marginPct.toFixed(0)}%)</span>
              </p>
            </div>
          </div>
        </div>
        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground">Faixas de referência — {REGIONS.find(r => r.key === region)?.label}</summary>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
            {PRICE_BANDS[region].map(b => (
              <div key={b.role} className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2 py-1 border-b border-border/50">
                <span>{b.role}</span>
                <span className="text-muted-foreground sm:whitespace-nowrap">
                  custo {formatBRL(b.costMin)}–{formatBRL(b.costMax)} · venda {formatBRL(b.priceMin)}–{formatBRL(b.priceMax)}
                </span>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* Sugestões por região */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-primary" /> Pacotes sugeridos — {REGIONS.find(r => r.key === region)?.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Ponto de partida com custo e venda sugeridos. Depois de adicionar, tudo é editável.</p>
        </div>
        <Dialog open={presetOpen} onOpenChange={setPresetOpen}>
          <DialogTrigger asChild>
            <Button type="button" size="sm" className="gap-1.5 w-full sm:w-auto"><Wand2 className="w-3.5 h-3.5" /> Ver sugestões</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pacotes sugeridos — {REGIONS.find(r => r.key === region)?.label}</DialogTitle>
              <DialogDescription>Escolha um modelo; ele entra na proposta já editável.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {presets.map(p => {
                const pt = presetTotals(p);
                return (
                  <div key={p.key} className="rounded-xl border border-border bg-card p-3 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm">{p.name}</p>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {p.tags.map(tag => (
                          <span key={tag} className="text-[9px] uppercase tracking-wide border border-primary/40 text-primary rounded px-1.5 py-0.5">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
                    <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                      {p.items.map(i => (
                        <li key={i.name}>• {i.quantity > 1 ? `${i.quantity}× ` : ""}{i.name} <span className="opacity-70">({formatBRL(i.unit_cost)} → {formatBRL(i.unit_price)})</span></li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-2 border-t border-border grid grid-cols-3 gap-1 text-[11px]">
                      <div><span className="block text-muted-foreground">Custo</span>{formatBRL(pt.cost)}</div>
                      <div><span className="block text-muted-foreground">Venda</span>{formatBRL(pt.price)}</div>
                      <div><span className="block text-muted-foreground">Margem</span><span className="text-primary">{pt.marginPct.toFixed(0)}%</span></div>
                    </div>
                    <Button type="button" size="sm" variant="outline" className="mt-3 gap-1.5" onClick={() => addPreset(p)}>
                      <Plus className="w-3.5 h-3.5" /> Adicionar e editar
                    </Button>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>


      {/* Packages */}
      <div className="space-y-3">
        {packages.map(p => {
          const isOpen = !!open[p.id];
          const cost = pkgCost(p);
          const price = pkgPrice(p);
          const m = price - cost;
          return (
            <div key={p.id} className="bg-card border border-border rounded-xl">
              <div className="flex items-center gap-2 p-3 sm:p-4">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(o => ({ ...o, [p.id]: !isOpen }))}>
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
                <Input value={p.name} onChange={e => updatePackage(p.id, { name: e.target.value })} className="h-8 flex-1 font-medium" />
                {p.is_courtesy && <Gift className="w-4 h-4 text-primary flex-shrink-0" />}
                <span className={`text-xs font-bold whitespace-nowrap hidden sm:block ${m >= 0 ? "text-primary" : "text-destructive"}`}>{formatBRL(m)}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removePackage(p.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
              </div>

              {isOpen && (
                <div className="px-3 sm:px-4 pb-4 space-y-4 border-t border-border pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs">Categoria</Label>
                      <select value={p.category} onChange={e => updatePackage(p.id, { category: e.target.value })}
                        className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
                        {PACKAGE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div><Label className="text-xs">Preço de venda</Label><Input type="number" value={p.sale_price ?? 0} onChange={e => updatePackage(p.id, { sale_price: e.target.value })} className="h-9" /></div>
                    <div><Label className="text-xs">Custo interno extra</Label><Input type="number" value={p.internal_cost ?? 0} onChange={e => updatePackage(p.id, { internal_cost: e.target.value })} className="h-9" /></div>
                    <div className="flex flex-col justify-end gap-1.5 text-xs">
                      <label className="flex items-center gap-2"><Checkbox checked={!!p.is_optional} onCheckedChange={v => updatePackage(p.id, { is_optional: !!v })} /> Opcional</label>
                      <label className="flex items-center gap-2"><Checkbox checked={!!p.is_courtesy} onCheckedChange={v => updatePackage(p.id, { is_courtesy: !!v })} /> Cortesia</label>
                      <label className="flex items-center gap-2"><Checkbox checked={!!p.recommended} onCheckedChange={v => updatePackage(p.id, { recommended: !!v })} /> Recomendado</label>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Descrição para o cliente</Label>
                      <AiTextButton kind="descrição de pacote de show" context={`${proposalLabel}. Pacote: ${p.name}. Itens: ${itemsOf(p.id).map(i => i.name).join(", ") || "não informados"}`}
                        current={p.description || ""} onResult={t => updatePackage(p.id, { description: t })} />
                    </div>
                    <Textarea rows={2} value={p.description || ""} onChange={e => updatePackage(p.id, { description: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Itens do pacote — custo {formatBRL(pkgItemsCost(p.id))} · venda {formatBRL(pkgItemsPrice(p.id))}</Label>
                      <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={() => addItem(p.id)}><Plus className="w-3 h-3" /> Item</Button>
                    </div>
                    {itemsOf(p.id).map(i => itemRow(i))}

                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={addPackage} className="gap-1.5"><Plus className="w-3.5 h-3.5" /> Novo pacote</Button>
          <Button variant="outline" size="sm" onClick={() => addItem(null)} className="gap-1.5"><Plus className="w-3.5 h-3.5" /> Item avulso</Button>
          <Button size="sm" onClick={saveAll} disabled={saving} className="gap-1.5"><Save className="w-3.5 h-3.5" /> {saving ? "Salvando..." : "Salvar tudo"}</Button>
        </div>
      </div>

      {/* Standalone items */}
      {itemsOf(null).length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <Label className="text-xs">Itens avulsos (opcionais fora dos pacotes)</Label>
          {itemsOf(null).map(i => (
            <div key={i.id} className="grid grid-cols-12 gap-2 items-center">
              <Input value={i.name} onChange={e => updateItem(i.id, { name: e.target.value })} className="h-8 col-span-12 sm:col-span-4 text-xs" />
              <select value={i.category} onChange={e => updateItem(i.id, { category: e.target.value })} className="h-8 col-span-5 sm:col-span-2 rounded-md border border-input bg-background px-1 text-xs">
                {ITEM_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <Input type="number" value={i.quantity} onChange={e => updateItem(i.id, { quantity: e.target.value })} className="h-8 col-span-2 sm:col-span-1 text-xs" />
              <Input type="number" value={i.unit_cost} onChange={e => updateItem(i.id, { unit_cost: e.target.value })} className="h-8 col-span-2 sm:col-span-2 text-xs" placeholder="Custo" />
              <Input type="number" value={i.unit_price} onChange={e => updateItem(i.id, { unit_price: e.target.value })} className="h-8 col-span-2 sm:col-span-2 text-xs" placeholder="Venda" />
              <div className="col-span-1 flex items-center justify-end gap-1">
                <Checkbox checked={!!i.is_courtesy} onCheckedChange={v => updateItem(i.id, { is_courtesy: !!v })} />
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeItem(i.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalPackages;
