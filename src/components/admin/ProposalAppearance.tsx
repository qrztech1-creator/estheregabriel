import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SortableList from "./SortableList";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  TEMPLATES, SECTION_LABELS, normalizeSectionOrder, buildThemeStyle,
  normalizeSections, SECTION_DEFAULT_COPY,
  type SectionKey, type ProposalTheme,
} from "@/data/templates";

interface Props { proposalId: string }

const hslToHex = (hsl?: string) => {
  if (!hsl) return "#000000";
  const [h, s, l] = hsl.replace(/%/g, "").split(/\s+/).map(Number);
  if ([h, s, l].some(n => Number.isNaN(n))) return "#000000";
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l / 100 - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const ProposalAppearance = ({ proposalId }: Props) => {
  const [template, setTemplate] = useState("classic");
  const [theme, setTheme] = useState<ProposalTheme>({});
  const [order, setOrder] = useState<SectionKey[]>(normalizeSectionOrder([]));
  const [sections, setSections] = useState(normalizeSections({}));
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [proposalId]);

  const load = async () => {
    const { data } = await supabase.from("proposals").select("template, theme, section_order, sections").eq("id", proposalId).maybeSingle();
    if (!data) return;
    const d = data as any;
    setTemplate(d.template || "classic");
    setTheme((d.theme || {}) as ProposalTheme);
    setOrder(normalizeSectionOrder(d.section_order));
    setSections(normalizeSections(d.sections));
  };

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("proposals")
      .update({ template, theme: theme as any, section_order: order as any, sections: sections as any })
      .eq("id", proposalId);
    setSaving(false);
    if (error) { toast.error("Erro ao salvar aparência"); return; }
    await supabase.from("proposal_audit_log").insert({
      proposal_id: proposalId, actor_type: "admin", action: "edited_proposal",
      changes: { secao: "aparência", template, ordem: order },
    });
    toast.success("Aparência salva!");
  };

  const preview = buildThemeStyle(template, theme);

  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
        <h3 className="font-semibold text-sm flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /> Modelo visual</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TEMPLATES.map(t => (
            <button key={t.key} type="button" onClick={() => setTemplate(t.key)}
              className={`text-left p-4 rounded-lg border transition-all ${template === t.key ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
              <p className="font-medium text-sm">{t.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
              <div className="flex gap-1.5 mt-3">
                {["--background", "--primary", "--foreground"].map(v => (
                  <span key={v} className="w-6 h-6 rounded-full border border-border"
                    style={{ background: t.vars[v] ? `hsl(${t.vars[v]})` : v === "--primary" ? "hsl(43 45% 52%)" : v === "--background" ? "hsl(0 0% 4%)" : "hsl(40 20% 92%)" }} />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
        <h3 className="font-semibold text-sm">Cores e imagens desta proposta</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {([
            ["background", "Fundo"],
            ["foreground", "Texto"],
            ["primary", "Destaque"],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <Label className="text-xs">{label}</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={hslToHex((theme as any)[key] || (preview as any)[`--${key}`] || "")}
                  onChange={e => setTheme(t => ({ ...t, [key]: hexToHsl(e.target.value) }))}
                  className="h-9 w-12 rounded border border-input bg-background" />
                <Input value={(theme as any)[key] || ""} placeholder="herda do modelo"
                  onChange={e => setTheme(t => ({ ...t, [key]: e.target.value || undefined }))} className="h-9 text-xs" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Imagem de capa (Hero)</Label>
            <Input value={theme.hero_image_url || ""} placeholder="https://..."
              onChange={e => setTheme(t => ({ ...t, hero_image_url: e.target.value || undefined }))} />
          </div>
          <div>
            <Label className="text-xs">Imagens da galeria (URLs separadas por vírgula)</Label>
            <Input value={(theme.gallery_image_urls || []).join(", ")}
              onChange={e => setTheme(t => ({
                ...t,
                gallery_image_urls: e.target.value.split(",").map(s => s.trim()).filter(Boolean),
              }))} />
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden" style={preview}>
          <div className="p-6" style={{ background: "hsl(var(--background))" }}>
            <p className="font-display text-2xl" style={{ color: "hsl(var(--foreground))" }}>Prévia do modelo</p>
            <p className="text-sm mt-1" style={{ color: "hsl(var(--primary))" }}>Destaque e tipografia da proposta</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-3">
        <h3 className="font-semibold text-sm">Seções da página</h3>
        <p className="text-xs text-muted-foreground">
          Arraste para reordenar, ligue/desligue cada seção e edite os textos que o cliente vê.
        </p>
        <SortableList
          items={order}
          getId={s => s}
          onReorder={setOrder}
          className="space-y-3"
          renderItem={(k, i) => {
            const cfg = sections[k];
            const setCfg = (patch: Partial<typeof cfg>) =>
              setSections(prev => ({ ...prev, [k]: { ...prev[k], ...patch } }));
            return (
              <div className={`rounded-lg border p-3 sm:p-4 space-y-3 bg-background ${cfg.visible ? "border-border" : "border-dashed border-border/60 opacity-70"}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground tabular-nums w-5">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm flex-1 min-w-0 truncate">{SECTION_LABELS[k]}</span>
                  <span className="text-[11px] text-muted-foreground hidden sm:inline">{cfg.visible ? "Visível" : "Oculta"}</span>
                  <Switch checked={cfg.visible} onCheckedChange={v => setCfg({ visible: v })} aria-label={`Exibir ${SECTION_LABELS[k]}`} />
                </div>
                {cfg.visible && k !== "hero" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Rótulo (linha superior)</Label>
                      <Input className="h-9 text-xs" value={cfg.eyebrow}
                        placeholder={SECTION_DEFAULT_COPY[k].eyebrow || "opcional"}
                        onChange={e => setCfg({ eyebrow: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">Título</Label>
                      <Input className="h-9 text-xs" value={cfg.title}
                        placeholder={SECTION_DEFAULT_COPY[k].title}
                        onChange={e => setCfg({ title: e.target.value })} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs">Descrição</Label>
                      <Textarea rows={2} className="text-xs" value={cfg.subtitle}
                        placeholder={SECTION_DEFAULT_COPY[k].subtitle || "opcional"}
                        onChange={e => setCfg({ subtitle: e.target.value })} />
                    </div>
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>

      <Button onClick={save} disabled={saving} className="gap-2"><Save className="w-4 h-4" />{saving ? "Salvando..." : "Salvar aparência"}</Button>
    </div>
  );
};

export default ProposalAppearance;
