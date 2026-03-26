import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown, X, Upload, Save, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { recalcPlanDiscounts } from "@/data/proposalTemplate";

interface Props {
  proposalId: string;
  onSaved: () => void;
  onBack: () => void;
  onDelete?: () => void;
}

const ProposalEditForm = ({ proposalId, onSaved, onBack, onDelete }: Props) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["casal", "evento"]));
  const [mp3File, setMp3File] = useState<File | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [form, setForm] = useState({
    bride_name: "", groom_name: "", event_date: "", event_start_time: "18:00", event_end_time: "22:00",
    venue_name: "", guest_count: 150, duration_label: "", proposal_deadline: "", whatsapp_number: "",
    slug: "", partnership_name: "", partnership_instagram: "", partnership_photo_url: "", created_by: "",
    pricing_plans: [] as any[], included_services: [] as any[], tech_details: [] as string[],
    event_timeline: [] as any[], process_steps: [] as any[], showcase_songs: [] as any[],
    optional_extras: [] as any[], extras_bundle_title: "", extras_bundle_price: 0, audio_url: "",
  });

  useEffect(() => { loadProposal(); }, [proposalId]);

  const loadProposal = async () => {
    const { data } = await supabase.from("proposals").select("*").eq("id", proposalId).maybeSingle();
    if (!data) { toast.error("Proposta não encontrada"); onBack(); return; }
    const d = data as any;
    setForm({
      bride_name: d.bride_name || "", groom_name: d.groom_name || "", event_date: d.event_date || "",
      event_start_time: d.event_start_time || "18:00", event_end_time: d.event_end_time || "22:00",
      venue_name: d.venue_name || "", guest_count: d.guest_count || 150,
      duration_label: d.duration_label || "", proposal_deadline: d.proposal_deadline || "",
      whatsapp_number: d.whatsapp_number || "", slug: d.slug || "",
      partnership_name: d.partnership_name || "", partnership_instagram: d.partnership_instagram || "",
      partnership_photo_url: d.partnership_photo_url || "", created_by: d.created_by || "",
      pricing_plans: d.pricing_plans || [], included_services: d.included_services || [],
      tech_details: d.tech_details || [], event_timeline: d.event_timeline || [],
      process_steps: d.process_steps || [], showcase_songs: d.showcase_songs || [],
      optional_extras: d.optional_extras || [], extras_bundle_title: d.extras_bundle_title || "",
      extras_bundle_price: Number(d.extras_bundle_price) || 0, audio_url: d.audio_url || "",
    });
    setLoading(false);
  };

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));
  const toggle = (key: string) => { const s = new Set(openSections); s.has(key) ? s.delete(key) : s.add(key); setOpenSections(s); };

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

  const handleSave = async () => {
    if (!form.bride_name || !form.groom_name || !form.event_date || !form.venue_name) {
      toast.error("Preencha os campos obrigatórios"); return;
    }
    setSubmitting(true);
    try {
      let audio_url: string | null = form.audio_url || null;
      if (mp3File) {
        const path = `${form.slug}/background.mp3`;
        await supabase.storage.from("proposal-audio").upload(path, mp3File, { upsert: true });
        const { data: urlData } = supabase.storage.from("proposal-audio").getPublicUrl(path);
        audio_url = urlData.publicUrl;
      }

      const { error } = await supabase.from("proposals").update({
        bride_name: form.bride_name, groom_name: form.groom_name, event_date: form.event_date,
        event_start_time: form.event_start_time, event_end_time: form.event_end_time,
        venue_name: form.venue_name, guest_count: form.guest_count,
        duration_label: form.duration_label, proposal_deadline: form.proposal_deadline || null,
        whatsapp_number: form.whatsapp_number, partnership_name: form.partnership_name || null,
        partnership_instagram: form.partnership_instagram || null,
        partnership_photo_url: form.partnership_photo_url || null, created_by: form.created_by || null,
        pricing_plans: form.pricing_plans as any, included_services: form.included_services as any,
        tech_details: form.tech_details as any, event_timeline: form.event_timeline as any,
        process_steps: form.process_steps as any, showcase_songs: form.showcase_songs as any,
        optional_extras: form.optional_extras as any, extras_bundle_title: form.extras_bundle_title || null,
        extras_bundle_price: form.extras_bundle_price || null, audio_url,
        updated_at: new Date().toISOString(),
      }).eq("id", proposalId);

      if (error) throw error;
      toast.success("Proposta atualizada!");
      onSaved();
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Delete related data first
      const { data: tokens } = await supabase.from("client_tokens").select("id").eq("proposal_id", proposalId);
      if (tokens?.length) {
        const tokenIds = tokens.map((t: any) => t.id);
        await supabase.from("song_preferences").delete().in("client_token_id", tokenIds);
        await supabase.from("song_suggestions").delete().in("client_token_id", tokenIds);
        await supabase.from("block_order_preferences").delete().in("client_token_id", tokenIds);
        await supabase.from("dj_playlist_links").delete().in("client_token_id", tokenIds);
        await supabase.from("client_tokens").delete().eq("proposal_id", proposalId);
      }
      await supabase.from("playlist_songs").delete().eq("proposal_id", proposalId);
      await supabase.from("playlist_blocks").delete().eq("proposal_id", proposalId);
      await supabase.from("proposals").delete().eq("id", proposalId);
      toast.success("Proposta excluída!");
      onDelete?.();
    } catch (err: any) {
      toast.error("Erro ao excluir");
    } finally {
      setDeleting(false);
    }
  };

  const renderSection = (id: string, title: string, children: React.ReactNode) => (
    <div className="border border-border rounded-lg overflow-hidden">
      <button onClick={() => toggle(id)} className="w-full p-4 flex justify-between items-center bg-card hover:bg-secondary/20 transition-colors">
        <h3 className="font-medium text-sm">{title}</h3>
        <ChevronDown className={`w-4 h-4 transition-transform ${openSections.has(id) ? "rotate-180" : ""}`} />
      </button>
      {openSections.has(id) && <div className="p-4 space-y-4 border-t border-border">{children}</div>}
    </div>
  );

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-4 h-4" /></Button>
          <h2 className="text-lg sm:text-xl font-semibold">Editar Proposta</h2>
        </div>
        <div className="flex gap-2">
          {!confirmDelete ? (
            <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(true)}><Trash2 className="w-4 h-4 mr-1" /> Excluir</Button>
          ) : (
            <div className="flex gap-2 items-center">
              <span className="text-xs text-destructive">Tem certeza?</span>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>{deleting ? "Excluindo..." : "Sim, excluir"}</Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {renderSection("casal", "👫 Dados do Casal *",
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Nome da noiva *</Label><Input value={form.bride_name} onChange={e => set("bride_name", e.target.value)} /></div>
            <div><Label>Nome do noivo *</Label><Input value={form.groom_name} onChange={e => set("groom_name", e.target.value)} /></div>
          </div>
        )}

        {renderSection("evento", "📅 Detalhes do Evento *",
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Data do evento *</Label><Input type="date" value={form.event_date} onChange={e => set("event_date", e.target.value)} /></div>
            <div><Label>Local *</Label><Input value={form.venue_name} onChange={e => set("venue_name", e.target.value)} /></div>
            <div><Label>Horário início</Label><Input value={form.event_start_time} onChange={e => set("event_start_time", e.target.value)} /></div>
            <div><Label>Horário fim</Label><Input value={form.event_end_time} onChange={e => set("event_end_time", e.target.value)} /></div>
            <div><Label>Convidados</Label><Input type="number" value={form.guest_count} onChange={e => set("guest_count", Number(e.target.value))} /></div>
            <div><Label>Duração (descrição)</Label><Input value={form.duration_label} onChange={e => set("duration_label", e.target.value)} /></div>
          </div>
        )}

        {renderSection("proposta", "⏰ Configuração da Proposta",
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Prazo da proposta</Label><Input type="datetime-local" value={form.proposal_deadline} onChange={e => set("proposal_deadline", e.target.value)} /></div>
            <div><Label>WhatsApp</Label><Input value={form.whatsapp_number} onChange={e => set("whatsapp_number", e.target.value)} /></div>
            <div><Label>Responsável pelo atendimento</Label><Input value={form.created_by} onChange={e => set("created_by", e.target.value)} placeholder="Nome do atendente" /></div>
            <div><Label>Slug (URL) — somente leitura</Label><Input value={form.slug} disabled className="opacity-60" /></div>
          </div>
        )}

        {renderSection("audio", "🎵 Música de Fundo (MP3)",
          <div>
            {form.audio_url && <p className="text-xs text-muted-foreground mb-2">Áudio atual: <a href={form.audio_url} target="_blank" className="text-primary underline">Ouvir</a></p>}
            <label className="flex items-center gap-2 px-4 py-2 rounded-sm border border-border bg-card hover:bg-secondary/20 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-primary" />
              <span className="text-sm">{mp3File ? mp3File.name : "Substituir arquivo"}</span>
              <input type="file" accept="audio/mpeg,audio/mp3" className="hidden" onChange={e => setMp3File(e.target.files?.[0] || null)} />
            </label>
          </div>
        )}

        {renderSection("pricing", `💰 Planos de Preço (${form.pricing_plans.length})`,
          <>
            {form.pricing_plans.map((plan: any, i: number) => (
              <div key={i} className="border border-border rounded-lg p-4 space-y-3 relative">
                <button onClick={() => set("pricing_plans", form.pricing_plans.filter((_: any, j: number) => j !== i))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label>Nome</Label><Input value={plan.label} onChange={e => updatePlan(i, "label", e.target.value)} /></div>
                  <div><Label>Descrição</Label><Input value={plan.description} onChange={e => updatePlan(i, "description", e.target.value)} /></div>
                  <div><Label>Valor Total (R$)</Label><Input type="number" value={plan.total} onChange={e => updatePlanTotal(i, Number(e.target.value))} /></div>
                  <div className="flex items-end"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={plan.recommended || false} onChange={e => updatePlan(i, "recommended", e.target.checked)} /> Recomendado</label></div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => set("pricing_plans", [...form.pricing_plans, { id: `plano-${Date.now()}`, label: "", description: "", total: 0, ...recalcPlanDiscounts(0), recommended: false }])}>+ Adicionar plano</Button>
          </>
        )}

        {renderSection("services", `🎵 Serviços Inclusos (${form.included_services.length})`,
          <>
            {form.included_services.map((s: any, i: number) => (
              <div key={i} className="flex gap-2 items-center">
                <Input value={s.text} onChange={e => { const arr = [...form.included_services]; arr[i] = { ...arr[i], text: e.target.value }; set("included_services", arr); }} className="flex-1" />
                <button onClick={() => set("included_services", form.included_services.filter((_: any, j: number) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => set("included_services", [...form.included_services, { icon: "Music", text: "" }])}>+ Adicionar</Button>
          </>
        )}

        {renderSection("tech", `🔧 Detalhes Técnicos (${form.tech_details.length})`,
          <>
            {form.tech_details.map((t: string, i: number) => (
              <div key={i} className="flex gap-2">
                <Input value={t} onChange={e => { const arr = [...form.tech_details]; arr[i] = e.target.value; set("tech_details", arr); }} className="flex-1" />
                <button onClick={() => set("tech_details", form.tech_details.filter((_: string, j: number) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => set("tech_details", [...form.tech_details, ""])}>+ Adicionar</Button>
          </>
        )}

        {renderSection("timeline", `🕐 Timeline do Evento (${form.event_timeline.length})`,
          <>
            {form.event_timeline.map((item: any, i: number) => (
              <div key={i} className="border border-border rounded p-3 space-y-2 relative">
                <button onClick={() => set("event_timeline", form.event_timeline.filter((_: any, j: number) => j !== i))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input value={item.time} onChange={e => { const arr = [...form.event_timeline]; arr[i] = { ...arr[i], time: e.target.value }; set("event_timeline", arr); }} placeholder="Horário" />
                  <Input value={item.duration} onChange={e => { const arr = [...form.event_timeline]; arr[i] = { ...arr[i], duration: e.target.value }; set("event_timeline", arr); }} placeholder="Duração" />
                  <Input value={item.title} onChange={e => { const arr = [...form.event_timeline]; arr[i] = { ...arr[i], title: e.target.value }; set("event_timeline", arr); }} placeholder="Título" />
                </div>
                <Textarea value={item.description} onChange={e => { const arr = [...form.event_timeline]; arr[i] = { ...arr[i], description: e.target.value }; set("event_timeline", arr); }} placeholder="Descrição" rows={2} />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => set("event_timeline", [...form.event_timeline, { time: "", duration: "", title: "", description: "", icon: "Music", details: [] }])}>+ Adicionar</Button>
          </>
        )}

        {renderSection("process", `📋 Etapas do Processo (${form.process_steps.length})`,
          <>
            {form.process_steps.map((step: any, i: number) => (
              <div key={i} className="border border-border rounded p-3 space-y-2 relative">
                <button onClick={() => set("process_steps", form.process_steps.filter((_: any, j: number) => j !== i))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input value={step.title} onChange={e => { const arr = [...form.process_steps]; arr[i] = { ...arr[i], title: e.target.value }; set("process_steps", arr); }} placeholder="Título" />
                  <Input value={step.date} onChange={e => { const arr = [...form.process_steps]; arr[i] = { ...arr[i], date: e.target.value }; set("process_steps", arr); }} placeholder="Data/Período" />
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={step.active || false} onChange={e => { const arr = [...form.process_steps]; arr[i] = { ...arr[i], active: e.target.checked }; set("process_steps", arr); }} /> Ativo</label>
                </div>
                <Input value={step.description} onChange={e => { const arr = [...form.process_steps]; arr[i] = { ...arr[i], description: e.target.value }; set("process_steps", arr); }} placeholder="Descrição" />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => set("process_steps", [...form.process_steps, { icon: "CheckCircle2", title: "", date: "", description: "", active: false }])}>+ Adicionar</Button>
          </>
        )}

        {renderSection("songs", `🎶 Músicas Destaque (${form.showcase_songs.length})`,
          <>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {form.showcase_songs.map((song: any, i: number) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input value={song.title} onChange={e => { const arr = [...form.showcase_songs]; arr[i] = { ...arr[i], title: e.target.value }; set("showcase_songs", arr); }} placeholder="Título" className="flex-1" />
                  <Input value={song.artist} onChange={e => { const arr = [...form.showcase_songs]; arr[i] = { ...arr[i], artist: e.target.value }; set("showcase_songs", arr); }} placeholder="Artista" className="flex-1" />
                  <button onClick={() => set("showcase_songs", form.showcase_songs.filter((_: any, j: number) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => set("showcase_songs", [...form.showcase_songs, { title: "", artist: "", videoId: "" }])}>+ Adicionar</Button>
          </>
        )}

        {renderSection("extras", "✨ Opcionais",
          <>
            {form.optional_extras.map((extra: any, i: number) => (
              <div key={i} className="border border-border rounded p-3 space-y-2 relative">
                <button onClick={() => set("optional_extras", form.optional_extras.filter((_: any, j: number) => j !== i))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                <Input value={extra.title} onChange={e => { const arr = [...form.optional_extras]; arr[i] = { ...arr[i], title: e.target.value }; set("optional_extras", arr); }} placeholder="Título" />
                <Textarea value={extra.description} onChange={e => { const arr = [...form.optional_extras]; arr[i] = { ...arr[i], description: e.target.value }; set("optional_extras", arr); }} placeholder="Descrição" rows={2} />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => set("optional_extras", [...form.optional_extras, { icon: "Monitor", title: "", description: "", details: [] }])}>+ Adicionar</Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div><Label>Título do pacote</Label><Input value={form.extras_bundle_title} onChange={e => set("extras_bundle_title", e.target.value)} /></div>
              <div><Label>Preço do pacote (R$)</Label><Input type="number" value={form.extras_bundle_price} onChange={e => set("extras_bundle_price", Number(e.target.value))} /></div>
            </div>
          </>
        )}

        {renderSection("partnership", "🤝 Parceria",
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Nome</Label><Input value={form.partnership_name} onChange={e => set("partnership_name", e.target.value)} /></div>
            <div><Label>Instagram (URL)</Label><Input value={form.partnership_instagram} onChange={e => set("partnership_instagram", e.target.value)} /></div>
            <div className="col-span-2"><Label>URL da foto</Label><Input value={form.partnership_photo_url} onChange={e => set("partnership_photo_url", e.target.value)} /></div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} disabled={submitting} className="flex-1 gap-2">
            <Save className="w-4 h-4" />
            {submitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Button variant="outline" onClick={onBack}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
};

export default ProposalEditForm;
