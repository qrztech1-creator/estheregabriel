import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import StrokeText from "./StrokeText";
import { useProposal } from "@/contexts/ProposalContext";
import MediaGallery, { type MediaEntry } from "./MediaGallery";
import { getSectionCopy } from "@/data/templates";

const formatBRL = (v: number) =>
  `R$ ${(Number(v) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export interface OptionalEntry {
  id: string;
  title: string;
  description: string;
  price: number;
  is_courtesy?: boolean;
  recommended?: boolean;
  image_url?: string | null;
  media?: MediaEntry[];
  details?: string[];
}

/**
 * Standard shape for every optional/additional service:
 * service name · description · price.
 * Sources (in order): optional packages, standalone package items, legacy optional_extras.
 */
export const collectOptionals = (proposal: any): OptionalEntry[] => {
  if (!proposal || proposal.show_optionals === false) return [];
  const out: OptionalEntry[] = [];

  (proposal.packages || []).forEach((p: any) => {
    if (!p.is_optional && p.category !== "extra") return;
    out.push({
      id: `pkg-${p.id}`,
      title: p.name,
      description: p.description || "",
      price: p.is_courtesy ? 0 : Number(p.sale_price) || 0,
      is_courtesy: !!p.is_courtesy,
      recommended: !!p.recommended,
      image_url: p.image_url || null,
      media: Array.isArray(p.media) ? p.media : [],
      details: (p.items || []).map((it: any) =>
        `${it.quantity > 1 ? `${it.quantity}× ` : ""}${it.name}${it.is_courtesy ? " (cortesia)" : ""}`),
    });
  });

  (proposal.extra_items || []).forEach((it: any) => {
    out.push({
      id: `item-${it.id}`,
      title: it.name,
      description: it.description || "",
      price: it.is_courtesy ? 0 : (Number(it.unit_price) || 0) * (Number(it.quantity) || 1),
      is_courtesy: !!it.is_courtesy,
      media: Array.isArray(it.media) ? it.media : [],
    });
  });

  const legacy = proposal.optional_extras || [];
  if (legacy.length) {
    const bundle = Number(proposal.extras_bundle_price) || 0;
    const perItem = bundle > 0 ? bundle / legacy.length : 0;
    legacy.forEach((e: any, i: number) => {
      out.push({
        id: `legacy-${i}`,
        title: e.title,
        description: e.description || "",
        price: Number(e.price) || perItem,
        image_url: e.image_url || null,
        media: Array.isArray(e.media) ? e.media : [],
        details: e.details || [],
      });
    });
  }

  return out;
};

const OptionalsSection = () => {
  const proposal = useProposal();
  const copy = getSectionCopy(proposal, "optionals");
  const options = collectOptionals(proposal);
  const whatsappNumber = proposal?.whatsapp_number ?? "5527999936682";

  if (!options.length) return null;

  return (
    <section className="py-12 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-ui text-xs tracking-[0.3em] uppercase text-primary mb-4">
            {copy.eyebrow}
          </motion.p>
          <StrokeText text={copy.title} fontSize="12rem" />
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="font-body text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
            {copy.subtitle}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {options.map((opt, i) => (
            <motion.div key={opt.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-sm border border-border/40 bg-secondary/20 backdrop-blur-sm overflow-hidden flex flex-col">
              {opt.image_url && (
                <img src={opt.image_url} alt={opt.title} loading="lazy" className="w-full h-40 object-cover" />
              )}
              <div className="p-6 md:p-7 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-display text-xl text-foreground font-light">{opt.title}</h3>
                  {opt.recommended && (
                    <span className="font-ui text-[9px] tracking-[0.15em] uppercase text-primary border border-primary/40 px-2 py-1 rounded-sm whitespace-nowrap">
                      Recomendado
                    </span>
                  )}
                </div>
                {opt.description && (
                  <p className="font-body text-sm text-foreground/70 mb-4 leading-relaxed">{opt.description}</p>
                )}
                {!!opt.details?.length && (
                  <ul className="space-y-2 mb-5">
                    {opt.details.map(d => (
                      <li key={d} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-[7px]" />
                        <span className="font-body text-sm text-foreground/60 leading-snug">{d}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <MediaGallery media={opt.media} />
                <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between gap-3">
                  <span className="font-ui text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Investimento</span>
                  <span className="font-display text-2xl text-foreground font-light">
                    {opt.is_courtesy || opt.price === 0 ? "Cortesia" : formatBRL(opt.price)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mt-10">
          <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá! Tenho interesse em alguns opcionais da proposta. Podemos conversar?")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 font-ui text-[10px] tracking-[0.2em] uppercase">
            <MessageCircle className="w-4 h-4" /> Falar sobre os opcionais
          </a>
          <p className="font-body text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" /> Você escolhe os adicionais no resumo da proposta.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default OptionalsSection;
