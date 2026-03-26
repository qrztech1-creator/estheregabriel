import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, ArrowLeft, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import logo from "@/assets/logo-homemusic.png";

const formatBRL = (val: number) => `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const ProposalSummaryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("entry50");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);

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

  const handleAccept = async () => {
    if (!proposal) return;
    setSubmitting(true);
    const plans = proposal.pricing_plans || [];
    const plan = plans[selectedPlanIdx];
    const paymentLabels: Record<string, string> = {
      entry30: "Entrada de 30%",
      entry50: "Entrada de 50%",
      aVista: "À Vista",
    };

    const { error } = await (supabase.from("proposals") as any).update({
      accepted_at: new Date().toISOString(),
      accepted_plan: { ...plan, payment_method: paymentLabels[paymentMethod] || paymentMethod },
      accepted_payment_method: paymentLabels[paymentMethod] || paymentMethod,
      accepted_notes: notes || null,
      contract_status: "accepted",
    }).eq("id", proposal.id);

    if (error) {
      toast.error("Erro ao confirmar proposta");
    } else {
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

  const paymentValues: Record<string, { value: number; savings: number }> = {
    entry30: { value: plan.entry30 || 0, savings: plan.savings30 || 0 },
    entry50: { value: plan.entry50 || 0, savings: plan.savings50 || 0 },
    aVista: { value: plan.aVista || 0, savings: plan.savingsAVista || 0 },
  };

  const selected = paymentValues[paymentMethod] || paymentValues.entry50;

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
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Data:</span> <strong>{eventDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</strong></div>
            <div><span className="text-muted-foreground">Local:</span> <strong>{proposal.venue_name}</strong></div>
            <div><span className="text-muted-foreground">Horário:</span> <strong>{proposal.event_start_time} — {proposal.event_end_time}</strong></div>
            <div><span className="text-muted-foreground">Convidados:</span> <strong>{proposal.guest_count}</strong></div>
            <div className="col-span-2"><span className="text-muted-foreground">Duração:</span> <strong>{proposal.duration_label}</strong></div>
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

        {/* Payment method */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-primary">Forma de Pagamento</h2>
          <div className="grid gap-2">
            {[
              { key: "entry30", label: "Entrada de 30%", desc: "4% de desconto" },
              { key: "entry50", label: "Entrada de 50%", desc: "10% de desconto" },
              { key: "aVista", label: "À Vista", desc: "12.5% de desconto" },
            ].map(opt => (
              <button key={opt.key} onClick={() => setPaymentMethod(opt.key)}
                className={`p-4 rounded-lg border text-left transition-all ${paymentMethod === opt.key ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg">{formatBRL(paymentValues[opt.key].value)}</p>
                    <p className="text-xs text-primary">Economia: {formatBRL(paymentValues[opt.key].savings)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-card border border-primary/30 rounded-xl p-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">Valor final com desconto</p>
          <p className="font-display text-4xl text-foreground">{formatBRL(selected.value)}</p>
          <p className="text-xs text-primary">Economia de {formatBRL(selected.savings)}</p>
        </div>

        {/* Notes */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-3">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-primary">Observações (opcional)</h2>
          <p className="text-xs text-muted-foreground">Informe como pretende realizar o pagamento (Pix, dinheiro, etc.) ou qualquer outra observação.</p>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ex: Pagamento será via Pix..." rows={3} />
          <p className="text-[10px] text-muted-foreground">* Para pagamento via cartão de crédito, consulte a taxa com o atendente.</p>
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
