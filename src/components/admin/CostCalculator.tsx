import { Plus, Trash2, Gift, ChevronDown, ChevronRight, Sparkles, Wand2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import SortableList from "./SortableList";
import AiTextButton from "./AiTextButton";
import { ITEM_CATEGORIES, PACKAGE_CATEGORIES, PRICE_BANDS, REGIONS, formatBRL, type RegionKey } from "@/data/regionPricing";
import { getPackagePresets, presetTotals, type PackagePreset } from "@/data/packagePresets";

export interface DraftItem {
  name: string; description?: string; category: string;
  quantity: number; unit_cost: number; unit_price: number;
  is_courtesy: boolean; is_optional: boolean;
}
export interface DraftPackage {
  name: string; description: string; category: string;
  sale_price: number; internal_cost: number;
  is_optional: boolean; is_courtesy: boolean; recommended: boolean;
  media?: MediaEntry[];
  items: DraftItem[];
}

export const emptyItem = (): DraftItem => ({
  name: "", description: "", category: "artista", quantity: 1,
  unit_cost: 0, unit_price: 0, is_courtesy: false, is_optional: false,
});
export const emptyPackage = (): DraftPackage => ({
  name: "Novo pacote", description: "", category: "festa",
  sale_price: 0, internal_cost: 0, is_optional: false, is_courtesy: false,
  recommended: false, media: [], items: [],
});

const itemsCost = (its: DraftItem[]) => its.reduce((s, i) => s + (Number(i.unit_cost) || 0) * (Number(i.quantity) || 1), 0);
const itemsPrice = (its: DraftItem[]) => its.reduce((s, i) => s + (i.is_courtesy ? 0 : (Number(i.unit_price) || 0) * (Number(i.quantity) || 1)), 0);

export const packageCost = (p: DraftPackage) => (Number(p.internal_cost) || 0) + itemsCost(p.items);

export const draftTotals = (packages: DraftPackage[], loose: DraftItem[]) => {
  const cost = packages.reduce((s, p) => s + packageCost(p), 0) + itemsCost(loose);
  const price = packages.filter(p => !p.is_optional).reduce((s, p) => s + (p.is_courtesy ? 0 : Number(p.sale_price) || 0), 0);
  const optional = packages.filter(p => p.is_optional).reduce((s, p) => s + (p.is_courtesy ? 0 : Number(p.sale_price) || 0), 0)
    + loose.reduce((s, i) => s + (i.is_courtesy ? 0 : (Number(i.unit_price) || 0) * (Number(i.quantity) || 1)), 0);
  const profit = price - cost;
  return { cost, price, optional, profit, marginPct: price > 0 ? (profit / price) * 100 : 0 };
};

const presetToDraft = (preset: PackagePreset): DraftPackage => ({
  name: preset.name,
  description: preset.description,
  category: preset.category,
  sale_price: presetTotals(preset).price,
  internal_cost: 0,
  is_optional: !!preset.is_optional,
  is_courtesy: false,
  recommended: false,
  items: preset.items.map(i => ({
    name: i.name, description: "", category: i.category,
    quantity: i.quantity, unit_cost: i.unit_cost, unit_price: i.unit_price,
    is_courtesy: false, is_optional: !!preset.is_optional,
  })),
});

interface Props {
  region: RegionKey;
  contextLabel: string;
  packages: DraftPackage[];
  looseItems: DraftItem[];
  onChange: (packages: DraftPackage[], looseItems: DraftItem[]) => void;
}

const CostCalculator = ({ region, contextLabel, packages, looseItems, onChange }: Props) => {
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true });
  const [presetOpen, setPresetOpen] = useState(false);
  const t = draftTotals(packages, looseItems);
  const presets = useMemo(() => getPackagePresets(region), [region]);
  const regionLabel = REGIONS.find(r => r.key === region)?.label ?? "";

  const setPkg = (i: number, patch: Partial<DraftPackage>) =>
    onChange(packages.map((p, j) => (j === i ? { ...p, ...patch } : p)), looseItems);
  const setItem = (pi: number, ii: number, patch: Partial<DraftItem>) =>
    setPkg(pi, { items: packages[pi].items.map((it, j) => (j === ii ? { ...it, ...patch } : it)) });

  const addPreset = (preset: PackagePreset) => {
    onChange([...packages, presetToDraft(preset)], looseItems);
    setOpen(o => ({ ...o, [packages.length]: true }));
    setPresetOpen(false);
  };

  const field = (label: string, node: React.ReactNode, className = "") => (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      {node}
    </div>
  );

  const itemRow = (it: DraftItem, onPatch: (p: Partial<DraftItem>) => void, onRemove: () => void) => {
    const total = (Number(it.unit_price) || 0) * (Number(it.quantity) || 1);
    const cost = (Number(it.unit_cost) || 0) * (Number(it.quantity) || 1);
    return (
      <div className="rounded-lg border border-border/70 bg-background/40 p-2.5 space-y-2">
        <div className="flex items-center gap-2">
          <Input value={it.name} onChange={e => onPatch({ name: e.target.value })} className="h-9 flex-1 text-sm" placeholder="Nome do item (ex: Violino)" />
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={onRemove}>
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {field("Categoria",
            <select value={it.category} onChange={e => onPatch({ category: e.target.value })} className="h-9 w-full rounded-md border border-input bg-background px-2 text-xs">
              {ITEM_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>)}
          {field("Qtd", <Input type="number" min={1} value={it.quantity} onChange={e => onPatch({ quantity: Number(e.target.value) })} className="h-9 text-xs" />)}
          {field("Custo unit.", <Input type="number" value={it.unit_cost} onChange={e => onPatch({ unit_cost: Number(e.target.value) })} className="h-9 text-xs" />)}
          {field("Venda unit.", <Input type="number" value={it.unit_price} onChange={e => onPatch({ unit_price: Number(e.target.value) })} className="h-9 text-xs" />)}
          {field("Cortesia",
            <label className="h-9 flex items-center gap-2 text-xs">
              <Checkbox checked={it.is_courtesy} onCheckedChange={v => onPatch({ is_courtesy: !!v })} />
              <span className="text-muted-foreground">grátis</span>
            </label>)}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Custo {formatBRL(cost)} · Venda {formatBRL(it.is_courtesy ? 0 : total)} ·
          <span className={(it.is_courtesy ? -cost : total - cost) >= 0 ? " text-primary" : " text-destructive"}>
            {" "}Lucro {formatBRL((it.is_courtesy ? 0 : total) - cost)}
          </span>
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Live margin bar */}
      <div className="sticky top-2 z-20 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-card border border-primary/30 rounded-xl p-3">
        <div><p className="text-[10px] text-muted-foreground uppercase">Custo interno</p><p className="text-sm font-bold">{formatBRL(t.cost)}</p></div>
        <div><p className="text-[10px] text-muted-foreground uppercase">Venda (fixos)</p><p className="text-sm font-bold">{formatBRL(t.price)}</p></div>
        <div><p className="text-[10px] text-muted-foreground uppercase">Opcionais</p><p className="text-sm font-bold">{formatBRL(t.optional)}</p></div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase">Lucro</p>
          <p className={`text-sm font-bold ${t.profit >= 0 ? "text-primary" : "text-destructive"}`}>
            {formatBRL(t.profit)} <span className="text-[10px]">({t.marginPct.toFixed(0)}%)</span>
          </p>
        </div>
      </div>

      {/* Sugestões por região */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-primary" /> Pacotes sugeridos — {regionLabel}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Valores são apenas sugestão: ao adicionar, tudo fica editável (itens, custo, venda, cortesia).
          </p>
        </div>
        <Dialog open={presetOpen} onOpenChange={setPresetOpen}>
          <DialogTrigger asChild>
            <Button type="button" size="sm" className="gap-1.5 w-full sm:w-auto"><Wand2 className="w-3.5 h-3.5" /> Ver sugestões</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pacotes sugeridos — {regionLabel}</DialogTitle>
              <DialogDescription>
                Escolha um ponto de partida. Depois de adicionar, edite nomes, itens, custo e preço à vontade.
              </DialogDescription>
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

      <details className="text-xs bg-card border border-border rounded-xl p-3">
        <summary className="cursor-pointer text-muted-foreground">
          Faixas de referência — {regionLabel}
        </summary>
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

      <SortableList
        items={packages}
        onReorder={list => onChange(list, looseItems)}
        className="space-y-3"
        renderItem={(p, i) => {
          const pc = packageCost(p);
          const pv = p.is_courtesy ? 0 : Number(p.sale_price) || 0;
          const sugerido = itemsPrice(p.items);
          return (
            <div className="bg-card border border-border rounded-xl">
              <div className="flex items-center gap-2 p-3">
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => setOpen(o => ({ ...o, [i]: !o[i] }))}>
                  {open[i] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
                <Input value={p.name} onChange={e => setPkg(i, { name: e.target.value })} className="h-8 flex-1 min-w-0 font-medium" />
                {p.is_courtesy && <Gift className="w-4 h-4 text-primary flex-shrink-0" />}
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0"
                  onClick={() => onChange([...packages, { ...p, name: `${p.name} (cópia)`, items: p.items.map(x => ({ ...x })) }], looseItems)} title="Duplicar">
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0"
                  onClick={() => onChange(packages.filter((_, j) => j !== i), looseItems)}>
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>

              <div className="px-3 pb-3 grid grid-cols-3 gap-2 text-[11px]">
                <div><span className="block text-muted-foreground uppercase text-[9px]">Custo</span>{formatBRL(pc)}</div>
                <div><span className="block text-muted-foreground uppercase text-[9px]">Venda</span>{formatBRL(pv)}</div>
                <div>
                  <span className="block text-muted-foreground uppercase text-[9px]">Lucro</span>
                  <span className={pv - pc >= 0 ? "text-primary" : "text-destructive"}>
                    {formatBRL(pv - pc)} ({pv > 0 ? (((pv - pc) / pv) * 100).toFixed(0) : "0"}%)
                  </span>
                </div>
              </div>

              {open[i] && (
                <div className="px-3 pb-4 space-y-3 border-t border-border pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs">Categoria</Label>
                      <select value={p.category} onChange={e => setPkg(i, { category: e.target.value })} className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
                        {PACKAGE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">Preço de venda</Label>
                      <Input type="number" value={p.sale_price} onChange={e => setPkg(i, { sale_price: Number(e.target.value) })} className="h-9" />
                      {sugerido > 0 && sugerido !== Number(p.sale_price) && (
                        <button type="button" onClick={() => setPkg(i, { sale_price: sugerido })}
                          className="mt-1 text-[10px] text-primary hover:underline">
                          Usar soma dos itens ({formatBRL(sugerido)})
                        </button>
                      )}
                    </div>
                    <div><Label className="text-xs">Custo interno extra</Label><Input type="number" value={p.internal_cost} onChange={e => setPkg(i, { internal_cost: Number(e.target.value) })} className="h-9" /></div>
                    <div className="flex flex-col justify-end gap-1.5 text-xs">
                      <label className="flex items-center gap-2"><Checkbox checked={p.is_optional} onCheckedChange={v => setPkg(i, { is_optional: !!v })} /> Opcional</label>
                      <label className="flex items-center gap-2"><Checkbox checked={p.is_courtesy} onCheckedChange={v => setPkg(i, { is_courtesy: !!v })} /> Cortesia</label>
                      <label className="flex items-center gap-2"><Checkbox checked={p.recommended} onCheckedChange={v => setPkg(i, { recommended: !!v })} /> Recomendado</label>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Descrição para o cliente</Label>
                      <AiTextButton kind="descrição de pacote de show"
                        context={`${contextLabel}. Pacote: ${p.name}. Itens: ${p.items.map(it => it.name).filter(Boolean).join(", ") || "não informados"}`}
                        current={p.description} onResult={txt => setPkg(i, { description: txt })} />
                    </div>
                    <Textarea rows={2} value={p.description} onChange={e => setPkg(i, { description: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-xs">Itens (custo × venda)</Label>
                      <Button type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs"
                        onClick={() => setPkg(i, { items: [...p.items, emptyItem()] })}>
                        <Plus className="w-3 h-3" /> Item
                      </Button>
                    </div>
                    <SortableList
                      items={p.items}
                      getId={(_, ii) => `pkg-${i}-item-${ii}`}
                      onReorder={list => setPkg(i, { items: list })}
                      className="space-y-2"
                      renderItem={(it, ii) => itemRow(it,
                        patch => setItem(i, ii, patch),
                        () => setPkg(i, { items: p.items.filter((_, j) => j !== ii) }))}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        }}
      />

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => { onChange([...packages, emptyPackage()], looseItems); setOpen(o => ({ ...o, [packages.length]: true })); }}>
          <Plus className="w-3.5 h-3.5" /> Novo pacote
        </Button>
        <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => onChange(packages, [...looseItems, { ...emptyItem(), is_optional: true }])}>
          <Plus className="w-3.5 h-3.5" /> Item avulso / opcional
        </Button>
      </div>

      {looseItems.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-3 space-y-2">
          <Label className="text-xs">Itens avulsos (opcionais fora dos pacotes)</Label>
          <SortableList
            items={looseItems}
            getId={(_, i) => `loose-${i}`}
            onReorder={list => onChange(packages, list)}
            className="space-y-2"
            renderItem={(it, i) => itemRow(it,
              patch => onChange(packages, looseItems.map((x, j) => (j === i ? { ...x, ...patch } : x))),
              () => onChange(packages, looseItems.filter((_, j) => j !== i)))}
          />
        </div>
      )}
    </div>
  );
};

export default CostCalculator;
