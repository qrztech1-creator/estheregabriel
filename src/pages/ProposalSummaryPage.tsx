import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import logo from "@/assets/logo-homemusic.png";

const formatBRL = (val: number) => `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const ProposalSummaryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("entry50");
  const [paymentTypes, setPaymentTypes] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!slug) { navigate("/"); return; }
    supabase.from("proposals").select("*").eq("slug", slug).eq("status", "active").maybeSingle()
      .then(({ data }) => {
        if (!data) { navigate("/"); return; }
        setProposal(data);
        const plans = (data as any).pricing_plans || [];
        const recIdx = plans.findIndex((p: any) => p.recommended);
        setSelectedPlanIdx(recIdx >= 0 ? recIdx : plans.length - 1);
        if ((data as any).accepted_at) setAccepted(true);
        setLoading(false);
      });
  }, [slug]);

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
    if (paymentTypes.length === 0) { toast.error("Selecione pelo menos uma forma de pagamento"); return; }
    setSubmitting(true);
    const plans = proposal.pricing_plans || [];
    const plan = plans[selectedPlanIdx];
    const paymentLabels: Record<string, string> = {
      entry30: "Entrada de 30%",
      entry50: "Entrada de 50%",
      aVista: "À Vista",
    };

    const extras = (proposal as any).show_optionals === false ? [] : (proposal.optional_extras || []);
    const sExtras = getSummaryExtrasForAccept(extras, proposal);
    const chosenExtras = sExtras.filter((_: any, i: number) => selectedExtras[`extra-${i}`]);
    const chosenExtrasTotal = chosenExtras.reduce((sum: number, e: any) => sum + (e.price || 0), 0);

    const baseTotal = (plan.total || 0) + chosenExtrasTotal;
    const discountRates: Record<string, number> = { entry30: 0.04, entry50: 0.10, aVista: 0.125 };
    const rate = discountRates[paymentMethod] || 0;
    const finalValue = +(baseTotal * (1 - rate)).toFixed(2);

    const acceptedPlanData = {
      ...plan,
      payment_method: paymentLabels[paymentMethod] || paymentMethod,
      payment_types: paymentTypes,
      extras_chosen: chosenExtras,
      extras_total: chosenExtrasTotal,
      final_value: finalValue,
    };

    const { error } = await supabase.from("proposals").update({
      accepted_at: new Date().toISOString(),
      accepted_plan: acceptedPlanData as any,
      accepted_payment_method: paymentLabels[paymentMethod] || paymentMethod,
      accepted_notes: notes || null,
      accepted_extras: chosenExtras as any,
      accepted_payment_types: paymentTypes,
      contract_status: "accepted",
      contract_value: finalValue,
    }).eq("id", proposal.id);

    if (error) {
      toast.error("Erro ao confirmar proposta");
    } else {
      // Log the acceptance
      await supabase.from("proposal_audit_log" as any).insert({
        proposal_id: proposal.id,
        actor_type: "client",
        actor_name: `${proposal.bride_name} & ${proposal.groom_name}`,
        action: "accepted",
        changes: {
          plan: plan.label,
          payment_discount: paymentLabels[paymentMethod],
          payment_types: paymentTypes,
          extras: chosenExtras.map((e: any) => e.title),
          final_value: finalValue,
          notes: notes || null,
        },
      });
      setAccepted(true);
      toast.success("Proposta confirmada com sucesso!");
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  );

  if (!proposal) return null;

  const plans = proposal.pricing_plans || [];
  const plan = plans[selectedPlanIdx] || {};
  const eventDate = new Date(proposal.event_date + "T12:00:00");
  const extras = (proposal as any).show_optionals === false ? [] : (proposal.optional_extras || []);

  const getSummaryExtras = (dbExtras: any[], prop: any) => {
    const items = dbExtras.map((e: any) => ({ ...e, price: 0 }));
    // Add palco option
    items.push({ icon: "Square", title: "Palco 4×3", description: "Estrutura de palco profissional 4×3 metros para a banda.", price: 1200, details: ["Montagem e desmontagem inclusa", "Estrutura segura e resistente"] });
    // Distribute bundle price across original extras
    if (prop.extras_bundle_price && dbExtras.length > 0) {
      const perItem = Number(prop.extras_bundle_price) / dbExtras.length;
      items.forEach((it: any, i: number) => { if (i < dbExtras.length) it.price = perItem; });
    }
    return items;
  };

  const summaryExtras = getSummaryExtras(extras, proposal);

  const discountRates: Record<string, number> = { entry30: 0.04, entry50: 0.10, aVista: 0.125 };
  const rate = discountRates[paymentMethod] || 0;

  const chosenExtrasTotal = summaryExtras.reduce((sum: number, e: any, i: number) => sum + (selectedExtras[`extra-${i}`] ? (e.price || 0) : 0), 0);
  const baseTotal = (plan.total || 0) + chosenExtrasTotal;
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

        {/* Plan selection */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-primary">Pacote Selecionado</h2>
          <div className="grid gap-2">
            {plans.map((p: any, i: number) => (
              <button key={i} onClick={() => setSelectedPlanIdx(i)}
                className={`p-4 rounded-lg border text-left transition-all ${selectedPlanIdx === i ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </div>
                  <p className="font-display text-lg">{formatBRL(p.total || 0)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Optional Extras */}
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

        {/* Payment type (checkbox) */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-primary">Forma de Pagamento</h2>
          <p className="text-xs text-muted-foreground">Selecione como pretende realizar o pagamento:</p>
          <div className="grid gap-3">
            {paymentTypeOptions.map(opt => (
              <label key={opt.key}
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${paymentTypes.includes(opt.key) ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                <Checkbox checked={paymentTypes.includes(opt.key)} onCheckedChange={() => togglePaymentType(opt.key)} className="mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{opt.label}</p>
                  {opt.warning && (
                    <p className="text-[11px] text-yellow-500 mt-0.5">⚠️ {opt.warning}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-card border border-primary/30 rounded-xl p-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">Valor final com desconto</p>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Pacote: {formatBRL(plan.total || 0)}</p>
            {chosenExtrasTotal > 0 && (
              <p className="text-sm text-muted-foreground">Opcionais: {formatBRL(chosenExtrasTotal)}</p>
            )}
          </div>
          <p className="font-display text-4xl text-foreground">{formatBRL(grandTotal)}</p>
          {totalSavings > 0 && <p className="text-xs text-primary">Economia de {formatBRL(totalSavings)}</p>}
        </div>

        {/* Notes */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-3">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-primary">Observações (opcional)</h2>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Qualquer observação adicional..." rows={3} />
        </div>

        {/* Accept */}
        <div className="flex flex-col gap-3">
          <Button onClick={handleAccept} disabled={submitting} className="w-full py-6 text-base gap-2">
            <Send className="w-5 h-5" />
            {submitting ? "Confirmando..." : "CONFIRMAR PROPOSTA"}
          </Button>
          <p className="text-[10px] text-center text-muted-foreground">Ao confirmar, nossa equipe entrará em contato para formalizar o contrato.</p>
        </div>
      </div>
    </div>
  );
};

export default ProposalSummaryPage;
