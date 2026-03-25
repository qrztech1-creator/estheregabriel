import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown, X, FileDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { proposalTemplate, generateSlug, recalcPlanDiscounts } from "@/data/proposalTemplate";

interface Props {
  onCreated: () => void;
  onCancel: () => void;
}

const ProposalForm = ({ onCreated, onCancel }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["casal", "evento"]));
  const [copyRepertoire, setCopyRepertoire] = useState(true);
  const [mp3File, setMp3File] = useState<File | null>(null);

  const [form, setForm] = useState({
    bride_name: "",
    groom_name: "",
    event_date: "",
    event_start_time: "18:00",
    event_end_time: "22:00",
    venue_name: "",
    guest_count: 150,
    duration_label: "4 Horas de Música Imersiva",
    proposal_deadline: "",
    whatsapp_number: "5527999936682",
    slug: "",
    partnership_name: "",
    partnership_instagram: "",
    partnership_photo_url: "",
    pricing_plans: [] as any[],
    included_services: [] as any[],
    tech_details: [] as string[],
    event_timeline: [] as any[],
    process_steps: [] as any[],
    showcase_songs: [] as any[],
    optional_extras: [] as any[],
    extras_bundle_title: "",
    extras_bundle_price: 0,
  });

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));
  const toggle = (key: string) => {
    const s = new Set(openSections);
    s.has(key) ? s.delete(key) : s.add(key);
    setOpenSections(s);
  };

  const loadTemplate = () => {
    setForm(f => ({
      ...f,
      ...proposalTemplate,
      bride_name: f.bride_name,
      groom_name: f.groom_name,
      event_date: f.event_date,
      venue_name: f.venue_name,
      slug: f.slug,
      proposal_deadline: f.proposal_deadline,
    }));
    setOpenSections(new Set(["casal", "evento", "proposta", "pricing", "services"]));
    toast.success("Modelo carregado!");
  };

  const updatePlanTotal = (i: number, total: number) => {
    const plans = [...form.pricing_plans];
    plans[i] = { ...plans[i], total, ...recalcPlanDiscounts(total) };
    set("pricing_plans", plans);
  };

  const updatePlan = (i: number, field: string, value: any) => {
    const plans = [...form.pricing_plans];
    plans[i] = { ...plans[i], [field]: value };
    set("pricing_plans", plans);
  };

  const handleSubmit = async () => {
    if (!form.bride_name || !form.groom_name || !form.event_date || !form.venue_name) {
      toast.error("Preencha os campos obrigatórios"); return;
    }
    setSubmitting(true);
    try {
      const slug = form.slug || generateSlug(form.bride_name, form.groom_name, form.event_date);

      let audio_url: string | null = null;
      if (mp3File) {
        const path = `${slug}/background.mp3`;
        const { error: uploadError } = await supabase.storage.from("proposal-audio").upload(path, mp3File, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("proposal-audio").getPublicUrl(path);
        audio_url = urlData.publicUrl;
      }

      const insertData: any = {
        slug,
        bride_name: form.bride_name,
        groom_name: form.groom_name,
        event_date: form.event_date,
        event_start_time: form.event_start_time,
        event_end_time: form.event_end_time,
        venue_name: form.venue_name,
        guest_count: form.guest_count,
        duration_label: form.duration_label,
        proposal_deadline: form.proposal_deadline || null,
        whatsapp_number: form.whatsapp_number,
        partnership_name: form.partnership_name || null,
        partnership_instagram: form.partnership_instagram || null,
        partnership_photo_url: form.partnership_photo_url || null,
        pricing_plans: form.pricing_plans,
        included_services: form.included_services,
        tech_details: form.tech_details,
        event_timeline: form.event_timeline,
        process_steps: form.process_steps,
        showcase_songs: form.showcase_songs,
        optional_extras: form.optional_extras,
        extras_bundle_title: form.extras_bundle_title || null,
        extras_bundle_price: form.extras_bundle_price || null,
        audio_url,
      };

      const { data: proposal, error } = await supabase.from("proposals").insert(insertData).select().single();
      if (error) throw error;
      const proposalRow = proposal as any;

      await supabase.from("client_tokens").insert({
        token: slug,
        client_name: `${form.bride_name} & ${form.groom_name}`,
        proposal_id: proposalRow.id,
      } as any);

      if (copyRepertoire) {
        const { data: srcProposals } = await (supabase.from("proposals") as any).select("id").neq("id", proposalRow.id).order("created_at").limit(1);
        const srcProposal = srcProposals?.[0];
        if (srcProposal) {
          const { data: srcBlocks } = await (supabase.from("playlist_blocks") as any).select("*").eq("proposal_id", (srcProposal as any).id).order("display_order");
          if (srcBlocks) {
            for (const block of srcBlocks) {
              const { data: newBlock } = await supabase.from("playlist_blocks").insert({
                name: block.name, display_order: block.display_order, proposal_id: proposalRow.id,
              } as any).select().single();
              if (newBlock) {
                const { data: srcSongs } = await supabase.from("playlist_songs").select("*").eq("block_id", block.id).order("display_order");
                if (srcSongs?.length) {
                  await supabase.from("playlist_songs").insert(
                    srcSongs.map((s: any) => ({
                      block_id: (newBlock as any).id, title: s.title, artist: s.artist,
                      display_order: s.display_order, proposal_id: proposalRow.id,
                    }))
                  );
                }
              }
            }
          }
        }
      }

      toast.success("Proposta criada!");
      onCreated();
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar proposta");
    } finally {
      setSubmitting(false);
    }
  };

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="border border-border rounded-lg overflow-hidden">
      <button onClick={() => toggle(id)} className="w-full p-4 flex justify-between items-center bg-card hover:bg-secondary/20 transition-colors">
        <h3 className="font-medium text-sm">{title}</h3>
        <ChevronDown className={`w-4 h-4 transition-transform ${openSections.has(id) ? "rotate-180" : ""}`} />
      </button>
      {openSections.has(id) && <div className="p-4 space-y-4 border-t border-border">{children}</div>}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Nova Proposta</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadTemplate}><FileDown className="w-4 h-4 mr-2" /> Carregar Modelo</Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancelar</Button>
        </div>
      </div>

      <div className="space-y-4">
        <Section id="casal" title="👫 Dados do Casal *">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Nome da noiva *</Label><Input value={form.bride_name} onChange={e => set("bride_name", e.target.value)} placeholder="Ex: Ana" /></div>
            <div><Label>Nome do noivo *</Label><Input value={form.groom_name} onChange={e => set("groom_name", e.target.value)} placeholder="Ex: Lucas" /></div>
          </div>
        </Section>

        <Section id="evento" title="📅 Detalhes do Evento *">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Data do evento *</Label><Input type="date" value={form.event_date} onChange={e => set("event_date", e.target.value)} /></div>
            <div><Label>Local *</Label><Input value={form.venue_name} onChange={e => set("venue_name", e.target.value)} placeholder="Ex: Espaço XYZ" /></div>
            <div><Label>Horário início</Label><Input value={form.event_start_time} onChange={e => set("event_start_time", e.target.value)} /></div>
            <div><Label>Horário fim</Label><Input value={form.event_end_time} onChange={e => set("event_end_time", e.target.value)} /></div>
            <div><Label>Convidados</Label><Input type="number" value={form.guest_count} onChange={e => set("guest_count", Number(e.target.value))} /></div>
            <div><Label>Duração (descrição)</Label><Input value={form.duration_label} onChange={e => set("duration_label", e.target.value)} /></div>
          </div>
        </Section>

        <Section id="proposta" title="⏰ Configuração da Proposta">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Prazo da proposta</Label><Input type="datetime-local" value={form.proposal_deadline} onChange={e => set("proposal_deadline", e.target.value)} /></div>
            <div><Label>WhatsApp</Label><Input value={form.whatsapp_number} onChange={e => set("whatsapp_number", e.target.value)} /></div>
            <div><Label>Slug (URL)</Label><Input value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="auto-gerado se vazio" /></div>
          </div>
        </Section>

        <Section id="audio" title="🎵 Música de Fundo (MP3)">
          <div>
            <Label>Arquivo MP3 para a página do casal</Label>
            <div className="mt-2 flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 rounded-sm border border-border bg-card hover:bg-secondary/20 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{mp3File ? mp3File.name : "Selecionar arquivo"}</span>
                <input type="file" accept="audio/mpeg,audio/mp3" className="hidden" onChange={e => setMp3File(e.target.files?.[0] || null)} />
              </label>
              {mp3File && <button onClick={() => setMp3File(null)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Este áudio tocará automaticamente quando o casal iniciar a experiência da página.</p>
          </div>
        </Section>

        <Section id="pricing" title={`💰 Planos de Preço (${form.pricing_plans.length})`}>
          {form.pricing_plans.map((plan: any, i: number) => (
            <div key={i} className="border border-border rounded-lg p-4 space-y-3 relative">
              <button onClick={() => set("pricing_plans", form.pricing_plans.filter((_: any, j: number) => j !== i))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Nome</Label><Input value={plan.label} onChange={e => updatePlan(i, "label", e.target.value)} /></div>
                <div><Label>Descrição</Label><Input value={plan.description} onChange={e => updatePlan(i, "description", e.target.value)} /></div>
                <div><Label>Valor Total (R$)</Label><Input type="number" value={plan.total} onChange={e => updatePlanTotal(i, Number(e.target.value))} /></div>
                <div className="flex items-end"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={plan.recommended || false} onChange={e => updatePlan(i, "recommended", e.target.checked)} /> Recomendado</label></div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <span>30%: R$ {plan.entry30?.toFixed(2)}</span>
                <span>50%: R$ {plan.entry50?.toFixed(2)}</span>
                <span>À vista: R$ {plan.aVista?.toFixed(2)}</span>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => set("pricing_plans", [...form.pricing_plans, { id: `plano-${form.pricing_plans.length + 1}`, label: "", description: "", total: 0, entry30: 0, savings30: 0, entry50: 0, savings50: 0, aVista: 0, savingsAVista: 0, recommended: false }])}>+ Adicionar plano</Button>
        </Section>

        <Section id="services" title={`🎵 Serviços Inclusos (${form.included_services.length})`}>
          {form.included_services.map((s: any, i: number) => (
            <div key={i} className="flex gap-2 items-center">
              <select value={s.icon} onChange={e => { const arr = [...form.included_services]; arr[i] = { ...arr[i], icon: e.target.value }; set("included_services", arr); }} className="bg-card border border-border rounded px-2 py-2 text-sm">
                <option value="Music">🎵 Música</option><option value="Disc3">💿 DJ</option><option value="Lightbulb">💡 Luz</option><option value="Volume2">🔊 Som</option>
              </select>
              <Input value={s.text} onChange={e => { const arr = [...form.included_services]; arr[i] = { ...arr[i], text: e.target.value }; set("included_services", arr); }} className="flex-1" />
              <Input value={s.badge || ""} onChange={e => { const arr = [...form.included_services]; arr[i] = { ...arr[i], badge: e.target.value }; set("included_services", arr); }} placeholder="Badge" className="w-24" />
              <button onClick={() => set("included_services", form.included_services.filter((_: any, j: number) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => set("included_services", [...form.included_services, { icon: "Music", text: "" }])}>+ Adicionar</Button>
        </Section>

        <Section id="tech" title={`🔧 Detalhes Técnicos (${form.tech_details.length})`}>
          {form.tech_details.map((t: string, i: number) => (
            <div key={i} className="flex gap-2">
              <Input value={t} onChange={e => { const arr = [...form.tech_details]; arr[i] = e.target.value; set("tech_details", arr); }} className="flex-1" />
              <button onClick={() => set("tech_details", form.tech_details.filter((_: string, j: number) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => set("tech_details", [...form.tech_details, ""])}>+ Adicionar</Button>
        </Section>

        <Section id="timeline" title={`🕐 Timeline do Evento (${form.event_timeline.length})`}>
          {form.event_timeline.map((item: any, i: number) => (
            <div key={i} className="border border-border rounded p-3 space-y-2 relative">
              <button onClick={() => set("event_timeline", form.event_timeline.filter((_: any, j: number) => j !== i))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
              <div className="grid grid-cols-3 gap-2">
                <Input value={item.time} onChange={e => { const arr = [...form.event_timeline]; arr[i] = { ...arr[i], time: e.target.value }; set("event_timeline", arr); }} placeholder="Horário" />
                <Input value={item.duration} onChange={e => { const arr = [...form.event_timeline]; arr[i] = { ...arr[i], duration: e.target.value }; set("event_timeline", arr); }} placeholder="Duração" />
                <Input value={item.title} onChange={e => { const arr = [...form.event_timeline]; arr[i] = { ...arr[i], title: e.target.value }; set("event_timeline", arr); }} placeholder="Título" />
              </div>
              <Textarea value={item.description} onChange={e => { const arr = [...form.event_timeline]; arr[i] = { ...arr[i], description: e.target.value }; set("event_timeline", arr); }} placeholder="Descrição" rows={2} />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => set("event_timeline", [...form.event_timeline, { time: "", duration: "", title: "", description: "", icon: "Music", details: [] }])}>+ Adicionar bloco</Button>
        </Section>

        <Section id="process" title={`📋 Etapas do Processo (${form.process_steps.length})`}>
          {form.process_steps.map((step: any, i: number) => (
            <div key={i} className="border border-border rounded p-3 space-y-2 relative">
              <button onClick={() => set("process_steps", form.process_steps.filter((_: any, j: number) => j !== i))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
              <div className="grid grid-cols-3 gap-2">
                <Input value={step.title} onChange={e => { const arr = [...form.process_steps]; arr[i] = { ...arr[i], title: e.target.value }; set("process_steps", arr); }} placeholder="Título" />
                <Input value={step.date} onChange={e => { const arr = [...form.process_steps]; arr[i] = { ...arr[i], date: e.target.value }; set("process_steps", arr); }} placeholder="Data/Período" />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={step.active || false} onChange={e => { const arr = [...form.process_steps]; arr[i] = { ...arr[i], active: e.target.checked }; set("process_steps", arr); }} /> Ativo</label>
              </div>
              <Input value={step.description} onChange={e => { const arr = [...form.process_steps]; arr[i] = { ...arr[i], description: e.target.value }; set("process_steps", arr); }} placeholder="Descrição" />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => set("process_steps", [...form.process_steps, { icon: "CheckCircle2", title: "", date: "", description: "", active: false }])}>+ Adicionar etapa</Button>
        </Section>

        <Section id="songs" title={`🎶 Músicas Destaque (${form.showcase_songs.length})`}>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {form.showcase_songs.map((song: any, i: number) => (
              <div key={i} className="flex gap-2 items-center">
                <Input value={song.title} onChange={e => { const arr = [...form.showcase_songs]; arr[i] = { ...arr[i], title: e.target.value }; set("showcase_songs", arr); }} placeholder="Título" className="flex-1" />
                <Input value={song.artist} onChange={e => { const arr = [...form.showcase_songs]; arr[i] = { ...arr[i], artist: e.target.value }; set("showcase_songs", arr); }} placeholder="Artista" className="flex-1" />
                <Input value={song.videoId} onChange={e => { const arr = [...form.showcase_songs]; arr[i] = { ...arr[i], videoId: e.target.value }; set("showcase_songs", arr); }} placeholder="YouTube ID" className="w-32" />
                <button onClick={() => set("showcase_songs", form.showcase_songs.filter((_: any, j: number) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => set("showcase_songs", [...form.showcase_songs, { title: "", artist: "", videoId: "" }])}>+ Adicionar música</Button>
        </Section>

        <Section id="extras" title="✨ Opcionais">
          {form.optional_extras.map((extra: any, i: number) => (
            <div key={i} className="border border-border rounded p-3 space-y-2 relative">
              <button onClick={() => set("optional_extras", form.optional_extras.filter((_: any, j: number) => j !== i))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
              <Input value={extra.title} onChange={e => { const arr = [...form.optional_extras]; arr[i] = { ...arr[i], title: e.target.value }; set("optional_extras", arr); }} placeholder="Título" />
              <Textarea value={extra.description} onChange={e => { const arr = [...form.optional_extras]; arr[i] = { ...arr[i], description: e.target.value }; set("optional_extras", arr); }} placeholder="Descrição" rows={2} />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => set("optional_extras", [...form.optional_extras, { icon: "Monitor", title: "", description: "", details: [] }])}>+ Adicionar</Button>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div><Label>Título do pacote</Label><Input value={form.extras_bundle_title} onChange={e => set("extras_bundle_title", e.target.value)} /></div>
            <div><Label>Preço do pacote (R$)</Label><Input type="number" value={form.extras_bundle_price} onChange={e => set("extras_bundle_price", Number(e.target.value))} /></div>
          </div>
        </Section>

        <Section id="partnership" title="🤝 Parceria">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Nome</Label><Input value={form.partnership_name} onChange={e => set("partnership_name", e.target.value)} /></div>
            <div><Label>Instagram (URL)</Label><Input value={form.partnership_instagram} onChange={e => set("partnership_instagram", e.target.value)} /></div>
            <div className="col-span-2"><Label>URL da foto</Label><Input value={form.partnership_photo_url} onChange={e => set("partnership_photo_url", e.target.value)} /></div>
          </div>
        </Section>

        <div className="border border-border rounded-lg p-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={copyRepertoire} onChange={e => setCopyRepertoire(e.target.checked)} className="w-4 h-4" />
            <div>
              <p className="text-sm font-medium">Copiar repertório do modelo</p>
              <p className="text-xs text-muted-foreground">Copia todos os blocos e músicas da primeira proposta existente</p>
            </div>
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
            {submitting ? "Criando..." : "Criar Proposta"}
          </Button>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
};

export default ProposalForm;
