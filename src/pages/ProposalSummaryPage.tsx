import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, ArrowLeft, Send, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import MediaGallery from "@/components/MediaGallery";
import BackgroundMusic from "@/components/BackgroundMusic";
import logo from "@/assets/logo-homemusic.png";

const formatBRL = (val: number) => `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const ProposalSummaryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlanIndices, setSelectedPlanIndices] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("entry50");
  const [paymentTypes, setPaymentTypes] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>({});
  const [selectedPkgIds, setSelectedPkgIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!slug) { navigate("/"); return; }
    supabase.rpc("get_public_proposal", { p_slug: slug })
      .then(({ data }) => {
        if (!data) { navigate("/"); return; }
        setProposal(data);
        const plans = (data as any).pricing_plans || [];
        
        // Try to get selected plans from URL query params
        const params = new URLSearchParams(window.location.search);
        const planosParam = params.get("planos");
        let initialIndices: number[] = [];
        
        if (planosParam) {
          initialIndices = planosParam.split(",").map(Number).filter(n => !isNaN(n) && n >= 0 && n < plans.length);
        }
        
        if (initialIndices.length === 0) {
          const recIdx = plans.findIndex((p: any) => p.recommended);
          initialIndices = [recIdx >= 0 ? recIdx : plans.length - 1].filter(n => n >= 0);
        }
        
        setSelectedPlanIndices(initialIndices);
        
        const pkgDefaults: Record<string, boolean> = {};
        ((data as any).packages || []).forEach((p: any) => { pkgDefaults[p.id] = !p.is_optional; });
        setSelectedPkgIds(pkgDefaults);
        if ((data as any).accepted_at) setAccepted(true);

        setLoading(false);
      });
  }, [slug, navigate]);

  const togglePlan = (idx: number) => {
    setSelectedPlanIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const togglePaymentType = (type: string) => {
    setPaymentTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const toggleExtra = (key: string) => {
    setSelectedExtras(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getSummaryExtrasForAccept = (dbExtras: any[], prop: any) => {
    const items = dbExtras.map((e: any) => ({ ...e, price: 0 }));
    items.push({ icon: "Square", title: "Palco 4×3", description: "Estrutura de palco profissional 4×3 metros para a banda.", price: 1200, details: ["Montagem e desmontagem inclusa", "Estrutura segura e resistente"] });
    if (prop.extras_bundle_price && dbExtras.length > 0) {
      const perItem = Number(prop.extras_bundle_price) / dbExtras.length;
      items.forEach((it: any, i: number) => { if (i < dbExtras.length) it.price = perItem; });
    }
    return items;
  };

  const handleAccept = async () => {
    if (!proposal) return;
    if (selectedPlanIndices.length === 0) { toast.error("Selecione pelo menos um pacote principal"); return; }
    if (paymentTypes.length === 0) { toast.error("Selecione pelo menos uma forma de pagamento"); return; }
    setSubmitting(true);
    
    const plans = proposal.pricing_plans || [];
    const chosenPlans = selectedPlanIndices.map(i => plans[i]);
    
    const paymentLabels: Record<string, string> = {
      entry30: "Entrada de 30%",
      entry50: "Entrada de 50%",
      aVista: "À Vista",
    };

    const extras = (proposal as any).show_optionals === false ? [] : (proposal.optional_extras || []);
    const sExtras = getSummaryExtrasForAccept(extras, proposal);
    const chosenExtras = sExtras.filter((_: any, i: number) => selectedExtras[`extra-${i}`]);
    const chosenExtrasTotal = chosenExtras.reduce((sum: number, e: any) => sum + (e.price || 0), 0);

    const chosenPkgs = ((proposal.packages || []) as any[]).filter((p: any) => selectedPkgIds[p.id]);
    const packagesTotal = chosenPkgs.reduce((s: number, p: any) => s + (p.is_courtesy ? 0 : Number(p.sale_price) || 0), 0);
    const selectedPackages = chosenPkgs.map((p: any) => ({
      id: p.id, name: p.name, is_courtesy: !!p.is_courtesy,
      sale_price: p.is_courtesy ? 0 : Number(p.sale_price) || 0,
    }));

    const plansTotal = chosenPlans.reduce((sum: number, p: any) => sum + (p.total || 0), 0);
    const baseTotal = plansTotal + chosenExtrasTotal + packagesTotal;
    const discountRates: Record<string, number> = { entry30: 0.04, entry50: 0.10, aVista: 0.125 };
    const rate = discountRates[paymentMethod] || 0;
    const finalValue = +(baseTotal * (1 - rate)).toFixed(2);

    const acceptedPlanData = {
      plans: chosenPlans,
      payment_method: paymentLabels[paymentMethod] || paymentMethod,
      payment_types: paymentTypes,
      extras_chosen: chosenExtras,
      extras_total: chosenExtrasTotal,
      packages_chosen: selectedPackages,
      packages_total: packagesTotal,
      final_value: finalValue,
    };

    const { data: ok, error } = await supabase.rpc("accept_proposal", {
      p_slug: proposal.slug,
      p_plan: acceptedPlanData as any,
      p_payment_method: paymentLabels[paymentMethod] || paymentMethod,
      p_payment_types: paymentTypes,
      p_extras: chosenExtras as any,
      p_notes: notes || null,
      p_final_value: finalValue,
      p_selected_packages: selectedPackages as any,
    });

    if (error || !ok) {
      toast.error("Erro ao confirmar proposta");
    } else {
      setAccepted(true);
      toast.success("Proposta confirmada com sucesso!");
    }

    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Music className="w-8 h-8 text-primary animate-pulse" />
    </div>
  );

  if (!proposal) return null;

  const plans = proposal.pricing_plans || [];
  const chosenPlans = selectedPlanIndices.map(i => plans[i]) || [];
  const eventDate = new Date(proposal.event_date + "T12:00:00");
  const extras = (proposal as any).show_optionals === false ? [] : (proposal.optional_extras || []);

  const getSummaryExtras = (dbExtras: any[], prop: any) => {
    const items = dbExtras.map((e: any) => ({ ...e, price: 0 }));
    items.push({ icon: "Square", title: "Palco 4×3", description: "Estrutura de palco profissional 4×3 metros para a banda.", price: 1200, details: ["Montagem e desmontagem inclusa", "Estrutura segura e resistente"] });
    if (prop.extras_bundle_price && dbExtras.length > 0) {
      const perItem = Number(prop.extras_bundle_price) / dbExtras.length;
      items.forEach((it: any, i: number) => { if (i < dbExtras.length) it.price = perItem; });
    }
    return items;
  };

  const summaryExtras = getSummaryExtras(extras, proposal);
  const packages: any[] = (proposal as any).packages || [];

  const discountRates: Record<string, number> = { entry30: 0.04, entry50: 0.10, aVista: 0.125 };
  const rate = discountRates[paymentMethod] || 0;

  const chosenExtrasTotal = summaryExtras.reduce((sum: number, e: any, i: number) => sum + (selectedExtras[`extra-${i}`] ? (e.price || 0) : 0), 0);
  const packagesTotal = packages.reduce((sum: number, p: any) => sum + (selectedPkgIds[p.id] && !p.is_courtesy ? Number(p.sale_price) || 0 : 0), 0);
  const plansTotal = chosenPlans.reduce((sum: number, p: any) => sum + (p.total || 0), 0);
  const baseTotal = plansTotal + chosenExtrasTotal + packagesTotal;
  const grandTotal = +(baseTotal * (1 - rate)).toFixed(2);
  const totalSavings = +(baseTotal * rate).toFixed(2);

  const paymentTypeOptions = [
    { key: "pix", label: "Pix" },
    { key: "dinheiro", label: "Dinheiro" },
    { key: "ted", label: "TED / Transferência" },
    { key: "credito", label: "Cartão de Crédito", warning: "Taxas aplicáveis — consulte o consultor" },
  ];

  if (accepted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <BackgroundMusic startPlaying audioUrl={proposal.audio_url || "/audio/background-music.mp3"} />
        <div className="max-w-lg w-full text-center space-y-6">
          <img src={logo} alt="Home Music" className="h-10 mx-auto" />
          <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary mx-auto flex items-center justify-center">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-light text-foreground">Proposta Confirmada!</h1>
          <p className="text-muted-foreground">
            {proposal.bride_name} & {proposal.groom_name}, sua proposta foi confirmada com sucesso. Entraremos em contato em breve para os próximos passos!
          </p>
          <Button variant="outline" onClick={() => navigate(`/proposta/${slug}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar à proposta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BackgroundMusic startPlaying audioUrl={proposal.audio_url || "/audio/background-music.mp3"} />
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src={logo} alt="Home Music" className="h-8" />
          <Button variant="ghost" size="sm" onClick={() => navigate(`/proposta/${slug}`)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center">
          <h1 className="font-display text-3xl md:text-4xl font-light mb-2">Resumo da Proposta</h1>
          <p className="text-muted-foreground text-sm">{proposal.bride_name} & {proposal.groom_name}</p>
        </div>

        {/* Event details */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-primary">Detalhes do Evento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Data:</span> <strong>{eventDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</strong></div>
            <div><span className="text-muted-foreground">Local:</span> <strong>{proposal.venue_name}</strong></div>
            <div><span className="text-muted-foreground">Horário:</span> <strong>{proposal.event_start_time} — {proposal.event_end_time}</strong></div>
            <div><span className="text-muted-foreground">Convidados:</span> <strong>{proposal.guest_count}</strong></div>
            <div className="col-span-1 sm:col-span-2"><span className="text-muted-foreground">Duração:</span> <strong>{proposal.duration_label}</strong></div>
          </div>
        </div>

        {/* Plan selection - Multi-select */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-primary">Pacotes Principais</h2>
          <p className="text-xs text-muted-foreground">Selecione os pacotes que deseja incluir na sua proposta.</p>
          <div className="grid gap-2">
            {plans.map((p: any, i: number) => {
              const active = selectedPlanIndices.includes(i);
              return (
                <button key={i} onClick={() => togglePlan(i)}
                  className={`p-4 rounded-lg border text-left transition-all ${active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${active ? "bg-primary border-primary" : "border-muted-foreground/40"}`}>
                      {active && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.description}</p>
                    </div>
                    <p className="font-display text-lg">{formatBRL(p.total || 0)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modular packages — multi-select */}
        {packages.length > 0 && (() => {
          const isExtra = (pk: any) => !!pk.is_optional || pk.category === "extra";
          const groups = [
            {
              key: "base",
              title: "Planos & Serviços",
              hint: "Selecione quantos quiser — pode acoplar cerimônia, festa e mais.",
              list: packages.filter(pk => !isExtra(pk)),
            },
            {
              key: "extra",
              title: "Opcionais & Adicionais",
              hint: "Iluminação, palco, painel e pista de LED — combine à vontade.",
              list: packages.filter(isExtra),
            },
          ].filter(g => g.list.length > 0);

          return groups.map(group => (
            <div key={group.key} className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <h2 className="font-semibold text-sm uppercase tracking-wider text-primary">{group.title}</h2>
                <p className="text-xs text-muted-foreground mt-1">{group.hint}</p>
              </div>
              <div className="grid gap-3">
                {group.list.map((pk: any) => {
                  const active = !!selectedPkgIds[pk.id];
                  return (
                    <div key={pk.id}
                      role="button" tabIndex={0}
                      onClick={() => setSelectedPkgIds(prev => ({ ...prev, [pk.id]: !prev[pk.id] }))}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedPkgIds(prev => ({ ...prev, [pk.id]: !prev[pk.id] })); } }}
                      className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${active ? "bg-primary border-primary" : "border-muted-foreground/40"}`}>
                          {active && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">
                            {pk.name}
                            {pk.is_courtesy && <span className="ml-2 text-[10px] uppercase tracking-wider text-primary">Cortesia</span>}
                            {pk.recommended && <span className="ml-2 text-[10px] uppercase tracking-wider text-primary">Recomendado</span>}
                          </p>
                          {pk.description && <p className="text-xs text-muted-foreground mt-1">{pk.description}</p>}
                          {(pk.items || []).length > 0 && (
                            <ul className="mt-2 space-y-0.5">
                              {pk.items.map((it: any) => (
                                <li key={it.id} className="text-[11px] text-muted-foreground">
                                  • {it.quantity > 1 ? `${it.quantity}× ` : ""}{it.name}{it.is_courtesy ? " (cortesia)" : ""}
                                </li>
                              ))}
                            </ul>
                          )}
                          <MediaGallery media={pk.media} />
                        </div>
                        <p className="font-display text-sm text-foreground whitespace-nowrap">
                          {pk.is_courtesy ? "Cortesia" : formatBRL(Number(pk.sale_price) || 0)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ));
        })()}

        {/* Optional Extras */}
        {(proposal as any).show_optionals !== false && summaryExtras.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-primary">Opcionais</h2>
          <div className="grid gap-3">
            {summaryExtras.map((extra: any, i: number) => (
              <button key={i} onClick={() => toggleExtra(`extra-${i}`)}
                className={`p-4 rounded-lg border text-left transition-all ${selectedExtras[`extra-${i}`] ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${selectedExtras[`extra-${i}`] ? "bg-primary border-primary" : "border-muted-foreground/40"}`}>
                    {selectedExtras[`extra-${i}`] && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{extra.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{extra.description}</p>
                  </div>
                  <p className="font-display text-sm text-foreground whitespace-nowrap">{formatBRL(extra.price)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        )}

        {/* Payment discount */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-primary">Condição de Pagamento</h2>
          <div className="grid gap-2">
            {[
              { key: "entry30", label: "Entrada de 30%" },
              { key: "entry50", label: "Entrada de 50%" },
              { key: "aVista", label: "À Vista" },
            ].map(opt => {
              const r = discountRates[opt.key] || 0;
              const val = +(baseTotal * (1 - r)).toFixed(2);
              const sav = +(baseTotal * r).toFixed(2);
              return (
                <button key={opt.key} onClick={() => setPaymentMethod(opt.key)}
                  className={`p-4 rounded-lg border text-left transition-all ${paymentMethod === opt.key ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm">{opt.label}</p>
                    <div className="text-right">
                      <p className="font-display text-lg">{formatBRL(val)}</p>
                      {sav > 0 && <p className="text-xs text-primary">Economia: {formatBRL(sav)}</p>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment types */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-primary">Formas de Pagamento</h2>
          <p className="text-xs text-muted-foreground">Selecione uma ou mais formas de pagamento para o restante do valor.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paymentTypeOptions.map(opt => (
              <button key={opt.key} onClick={() => togglePaymentType(opt.key)}
                className={`p-4 rounded-lg border text-left transition-all ${paymentTypes.includes(opt.key) ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${paymentTypes.includes(opt.key) ? "bg-primary border-primary" : "border-muted-foreground/40"}`}>
                    {paymentTypes.includes(opt.key) && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{opt.label}</p>
                    {opt.warning && <p className="text-[10px] text-destructive leading-tight mt-0.5">{opt.warning}</p>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-primary">Observações Adicionais</h2>
          <Textarea placeholder="Alguma dúvida ou observação sobre o contrato, repertório ou logística?"
            value={notes} onChange={e => setNotes(e.target.value)}
            className="min-h-[100px] resize-none" />
        </div>

        {/* Final Summary & Action */}
        <div className="bg-primary/5 border border-primary/30 rounded-xl p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal (Itens Selecionados)</span>
              <span>{formatBRL(baseTotal)}</span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between text-sm text-primary">
                <span>Desconto ({paymentMethod === "aVista" ? "12,5%" : paymentMethod === "entry50" ? "10%" : "4%"})</span>
                <span>- {formatBRL(totalSavings)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-primary/20 flex justify-between items-baseline">
              <span className="font-semibold text-lg">Total do Investimento</span>
              <div className="text-right">
                <span className="font-display text-3xl text-primary">{formatBRL(grandTotal)}</span>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Valor Final com Desconto</p>
              </div>
            </div>
          </div>

          <Button className="w-full h-14 text-base font-bold uppercase tracking-widest gap-2"
            disabled={submitting} onClick={handleAccept}>
            {submitting ? "Confirmando..." : <><Send className="w-5 h-5" /> Confirmar Proposta</>}
          </Button>
          <p className="text-[10px] text-center text-muted-foreground">
            Ao confirmar, nossa equipe receberá sua escolha e entrará em contato para formalização do contrato.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProposalSummaryPage;
