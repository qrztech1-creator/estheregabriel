import { Plus, Trash2, Gift, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import SortableList from "./SortableList";
import AiTextButton from "./AiTextButton";
import { ITEM_CATEGORIES, PACKAGE_CATEGORIES, PRICE_BANDS, REGIONS, formatBRL, type RegionKey } from "@/data/regionPricing";

export interface DraftItem {
  name: string; description?: string; category: string;
  quantity: number; unit_cost: number; unit_price: number;
  is_courtesy: boolean; is_optional: boolean;
}
export interface DraftPackage {
  name: string; description: string; category: string;
  sale_price: number; internal_cost: number;
  is_optional: boolean; is_courtesy: boolean; recommended: boolean;
  items: DraftItem[];
}

export const emptyItem = (): DraftItem => ({
  name: "", description: "", category: "artista", quantity: 1,
  unit_cost: 0, unit_price: 0, is_courtesy: false, is_optional: false,
});
export const emptyPackage = (): DraftPackage => ({
  name: "Novo pacote", description: "", category: "festa",
  sale_price: 0, internal_cost: 0, is_optional: false, is_courtesy: false,
  recommended: false, items: [],
});

export const draftTotals = (packages: DraftPackage[], loose: DraftItem[]) => {
  const itemsCost = (its: DraftItem[]) => its.reduce((s, i) => s + (Number(i.unit_cost) || 0) * (Number(i.quantity) || 1), 0);
  const cost = packages.reduce((s, p) => s + (Number(p.internal_cost) || 0) + itemsCost(p.items), 0) + itemsCost(loose);
  const price = packages.filter(p => !p.is_optional).reduce((s, p) => s + (p.is_courtesy ? 0 : Number(p.sale_price) || 0), 0);
  const optional = packages.filter(p => p.is_optional).reduce((s, p) => s + (p.is_courtesy ? 0 : Number(p.sale_price) || 0), 0)
    + loose.reduce((s, i) => s + (i.is_courtesy ? 0 : (Number(i.unit_price) || 0) * (Number(i.quantity) || 1)), 0);
  const profit = price - cost;
  return { cost, price, optional, profit, marginPct: price > 0 ? (profit / price) * 100 : 0 };
};

interface Props {
  region: RegionKey;
  contextLabel: string;
  packages: DraftPackage[];
  looseItems: DraftItem[];
  onChange: (packages: DraftPackage[], looseItems: DraftItem[]) => void;
}

const CostCalculator = ({ region, contextLabel, packages, looseItems, onChange }: Props) => {
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true });
  const t = draftTotals(packages, looseItems);

  const setPkg = (i: number, patch: Partial<DraftPackage>) =>
    onChange(packages.map((p, j) => (j === i ? { ...p, ...patch } : p)), looseItems);
  const setItem = (pi: number, ii: number, patch: Partial<DraftItem>) =>
    setPkg(pi, { items: packages[pi].items.map((it, j) => (j === ii ? { ...it, ...patch } : it)) });

  const itemRow = (it: DraftItem, onPatch: (p: Partial<DraftItem>) => void, onRemove: () => void) => (
    <div className="grid grid-cols-12 gap-2 items-center">
      <Input value={it.name} onChange={e => onPatch({ name: e.target.value })} className="h-8 col-span-12 sm:col-span-4 text-xs" placeholder="Nome do item" />
      <select value={it.category} onChange={e => onPatch({ category: e.target.value })} className="h-8 col-span-5 sm:col-span-2 rounded-md border border-input bg-background px-1 text-xs">
        {ITEM_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
      </select>
      <Input type="number" value={it.quantity} onChange={e => onPatch({ quantity: Number(e.target.value) })} className="h-8 col-span-2 sm:col-span-1 text-xs" title="Quantidade" />
      <Input type="number" value={it.unit_cost} onChange={e => onPatch({ unit_cost: Number(e.target.value) })} className="h-8 col-span-2 text-xs" placeholder="Custo" title="Custo unitário" />
      <Input type="number" value={it.unit_price} onChange={e => onPatch({ unit_price: Number(e.target.value) })} className="h-8 col-span-2 text-xs" placeholder="Venda" title="Venda unitária" />
      <div className="col-span-1 flex items-center justify-end gap-1">
        <Checkbox checked={it.is_courtesy} onCheckedChange={v => onPatch({ is_courtesy: !!v })} title="Cortesia" />
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={onRemove}><Trash2 className="w-3 h-3 text-destructive" /></Button>
      </div>
    </div>
  );

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

      <details className="text-xs bg-card border border-border rounded-xl p-3">
        <summary className="cursor-pointer text-muted-foreground">
          Faixas de referência — {REGIONS.find(r => r.key === region)?.label}
        </summary>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
          {PRICE_BANDS[region].map(b => (
            <div key={b.role} className="flex justify-between gap-2 py-1 border-b border-border/50">
              <span>{b.role}</span>
              <span className="text-muted-foreground whitespace-nowrap">
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
        renderItem={(p, i) => (
          <div className="bg-card border border-border rounded-xl">
            <div className="flex items-center gap-2 p-3">
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(o => ({ ...o, [i]: !o[i] }))}>
                {open[i] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
              <Input value={p.name} onChange={e => setPkg(i, { name: e.target.value })} className="h-8 flex-1 font-medium" />
              {p.is_courtesy && <Gift className="w-4 h-4 text-primary flex-shrink-0" />}
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7"
                onClick={() => onChange(packages.filter((_, j) => j !== i), looseItems)}>
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </Button>
            </div>

            {open[i] && (
              <div className="px-3 pb-4 space-y-3 border-t border-border pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <Label className="text-xs">Categoria</Label>
                    <select value={p.category} onChange={e => setPkg(i, { category: e.target.value })} className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
                      {PACKAGE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div><Label className="text-xs">Preço de venda</Label><Input type="number" value={p.sale_price} onChange={e => setPkg(i, { sale_price: Number(e.target.value) })} className="h-9" /></div>
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
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Itens (custo x venda)</Label>
                    <Button type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs"
                      onClick={() => setPkg(i, { items: [...p.items, emptyItem()] })}>
                      <Plus className="w-3 h-3" /> Item
                    </Button>
                  </div>
                  <SortableList
                    items={p.items}
                    getId={(_, ii) => `pkg-${i}-item-${ii}`}
                    onReorder={list => setPkg(i, { items: list })}
                    renderItem={(it, ii) => itemRow(it,
                      patch => setItem(i, ii, patch),
                      () => setPkg(i, { items: p.items.filter((_, j) => j !== ii) }))}
                  />
                </div>
              </div>
            )}
          </div>
        )}
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
