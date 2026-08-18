import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileDown, MessageCircle, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildClientPdf, buildInternalPdf, pdfFileName } from "@/lib/proposalPdf";

interface Props { proposalId: string; proposal: any }

const ProposalExport = ({ proposalId, proposal }: Props) => {
  const [busy, setBusy] = useState<string | null>(null);

  const fetchData = async () => {
    const [pkgs, items, checklist, internal] = await Promise.all([
      supabase.from("proposal_packages").select("*").eq("proposal_id", proposalId).order("display_order"),
      supabase.from("proposal_package_items").select("*").eq("proposal_id", proposalId).order("display_order"),
      supabase.from("proposal_checklist").select("*").eq("proposal_id", proposalId).order("display_order"),
      supabase.from("proposal_internal_contracts").select("*").eq("proposal_id", proposalId).maybeSingle(),
    ]);
    return {
      proposal,
      packages: pkgs.data || [],
      items: items.data || [],
      checklist: checklist.data || [],
      internal: internal.data || null,
    };
  };

  const exportPdf = async (kind: "cliente" | "interno") => {
    setBusy(kind);
    try {
      const data = await fetchData();
      const doc = kind === "cliente" ? buildClientPdf(data) : buildInternalPdf(data);
      doc.save(pdfFileName(proposal, kind));
      toast.success(`PDF ${kind} gerado!`);
    } catch (e: any) {
      toast.error("Erro ao gerar PDF");
      console.error(e);
    } finally {
      setBusy(null);
    }
  };

  const link = `${window.location.origin}/proposta/${proposal.slug}`;
  const msg = `Olá ${proposal.bride_name} e ${proposal.groom_name}! Segue a proposta musical da Home Music para o evento de vocês: ${link}`;
  const waNumber = (proposal.client_phone || "").replace(/\D/g, "");
  const waHref = `https://wa.me/${waNumber ? (waNumber.length > 11 ? waNumber : `55${waNumber}`) : ""}?text=${encodeURIComponent(msg)}`;
  const mailHref = `mailto:${proposal.client_email || ""}?subject=${encodeURIComponent("Proposta musical — Home Music")}&body=${encodeURIComponent(`${msg}\n\nO PDF da proposta segue em anexo.`)}`;

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
      <h3 className="font-semibold text-sm flex items-center gap-2"><FileDown className="w-4 h-4 text-primary" /> Exportar &amp; enviar</h3>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="gap-1.5" onClick={() => exportPdf("cliente")} disabled={busy === "cliente"}>
          <FileDown className="w-3.5 h-3.5" /> {busy === "cliente" ? "Gerando..." : "PDF do cliente"}
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => exportPdf("interno")} disabled={busy === "interno"}>
          <Lock className="w-3.5 h-3.5" /> {busy === "interno" ? "Gerando..." : "PDF interno (custos + checklist + contrato)"}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" asChild className="gap-1.5">
          <a href={waHref} target="_blank" rel="noopener noreferrer"><MessageCircle className="w-3.5 h-3.5" /> Enviar por WhatsApp</a>
        </Button>
        <Button size="sm" variant="outline" asChild className="gap-1.5">
          <a href={mailHref}><Mail className="w-3.5 h-3.5" /> Enviar por e-mail</a>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        O PDF interno contém custos, margem, checklist e repasses — não envie ao cliente.
      </p>
    </div>
  );
};

export default ProposalExport;
