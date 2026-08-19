import jsPDF from "jspdf";

const BRL = (v: number) =>
  `R$ ${(Number(v) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const GOLD: [number, number, number] = [176, 141, 87];
const DARK: [number, number, number] = [26, 26, 26];
const GREY: [number, number, number] = [110, 110, 110];

const M = 48;          // margin
const W = 595.28;      // A4 width (pt)
const H = 841.89;      // A4 height (pt)
const CW = W - M * 2;  // content width

interface Ctx { doc: jsPDF; y: number; page: number; title: string }

const newDoc = (title: string): Ctx => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.setProperties({ title });
  return { doc, y: 0, page: 0, title };
};

const footer = (c: Ctx) => {
  c.doc.setFont("helvetica", "normal").setFontSize(7).setTextColor(...GREY);
  c.doc.text("Home Music — Experiências Musicais", M, H - 26);
  c.doc.text(String(c.page), W - M, H - 26, { align: "right" });
};

const addPage = (c: Ctx) => {
  if (c.page > 0) { footer(c); c.doc.addPage(); }
  c.page += 1;
  c.doc.setFillColor(255, 255, 255).rect(0, 0, W, H, "F");
  c.doc.setFillColor(...GOLD).rect(0, 0, W, 4, "F");
  c.y = M + 14;
};

const ensure = (c: Ctx, needed: number) => { if (c.y + needed > H - 60) addPage(c); };

const h1 = (c: Ctx, text: string) => {
  ensure(c, 46);
  c.doc.setFont("helvetica", "bold").setFontSize(20).setTextColor(...DARK);
  c.doc.text(text, M, c.y);
  c.y += 10;
  c.doc.setDrawColor(...GOLD).setLineWidth(1).line(M, c.y, M + 60, c.y);
  c.y += 22;
};

const h2 = (c: Ctx, text: string) => {
  ensure(c, 34);
  c.y += 6;
  c.doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...GOLD);
  c.doc.text(text.toUpperCase(), M, c.y);
  c.y += 16;
};

const para = (c: Ctx, text: string, size = 9.5, color = DARK) => {
  if (!text) return;
  c.doc.setFont("helvetica", "normal").setFontSize(size).setTextColor(...color);
  const lines = c.doc.splitTextToSize(text, CW) as string[];
  lines.forEach(line => {
    ensure(c, 16);
    c.doc.text(line, M, c.y);
    c.y += size + 4;
  });
};

const kv = (c: Ctx, pairs: [string, string][]) => {
  const colW = CW / 2;
  pairs.forEach((p, i) => {
    if (i % 2 === 0) ensure(c, 20);
    const x = M + (i % 2) * colW;
    c.doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...GREY);
    c.doc.text(p[0], x, c.y);
    c.doc.setFont("helvetica", "bold").setFontSize(9.5).setTextColor(...DARK);
    c.doc.text(c.doc.splitTextToSize(p[1] || "—", colW - 12)[0], x, c.y + 12);
    if (i % 2 === 1 || i === pairs.length - 1) c.y += 30;
  });
};

const row = (c: Ctx, cells: string[], widths: number[], opts: { bold?: boolean; muted?: boolean } = {}) => {
  const height = 16;
  ensure(c, height + 4);
  c.doc.setFont("helvetica", opts.bold ? "bold" : "normal").setFontSize(8.5);
  c.doc.setTextColor(...(opts.muted ? GREY : DARK));
  let x = M;
  cells.forEach((cell, i) => {
    const align = i === cells.length - 1 && cells.length > 1 ? "right" : "left";
    const text = c.doc.splitTextToSize(cell || "", widths[i] - 6)[0] || "";
    c.doc.text(text, align === "right" ? x + widths[i] : x, c.y, { align: align as any });
    x += widths[i];
  });
  c.y += height;
};

const divider = (c: Ctx) => {
  ensure(c, 12);
  c.doc.setDrawColor(225, 225, 225).setLineWidth(0.5).line(M, c.y - 8, W - M, c.y - 8);
  c.y += 4;
};

const totalBox = (c: Ctx, label: string, value: string, accent = GOLD) => {
  ensure(c, 56);
  c.doc.setFillColor(248, 246, 242).rect(M, c.y - 4, CW, 44, "F");
  c.doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...GREY);
  c.doc.text(label, M + 14, c.y + 14);
  c.doc.setFont("helvetica", "bold").setFontSize(17).setTextColor(...accent);
  c.doc.text(value, W - M - 14, c.y + 18, { align: "right" });
  c.y += 56;
};

export interface PdfData {
  proposal: any;
  packages: any[];
  items: any[];
  checklist?: any[];
  internal?: any;
}

const header = (c: Ctx, p: any, kicker: string) => {
  addPage(c);
  c.doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...GOLD);
  c.doc.text("HOME MUSIC", M, c.y);
  c.doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...GREY);
  c.doc.text(kicker, W - M, c.y, { align: "right" });
  c.y += 30;
  c.doc.setFont("helvetica", "bold").setFontSize(24).setTextColor(...DARK);
  c.doc.text(`${p.bride_name} & ${p.groom_name}`, M, c.y);
  c.y += 18;
  c.doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...GREY);
  const d = p.event_date ? new Date(p.event_date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }) : "";
  c.doc.text([d, p.venue_name].filter(Boolean).join(" · "), M, c.y);
  c.y += 26;
};

const itemsOf = (items: any[] | undefined, pkgId: string | null) =>
  (items || []).filter(i => (i.package_id || null) === pkgId);

export const buildClientPdf = (data: PdfData) => {
  const { proposal: p, packages, items } = data;
  const c = newDoc(`Proposta ${p.bride_name} & ${p.groom_name}`);
  header(c, p, "Proposta comercial");

  h2(c, "Detalhes do evento");
  kv(c, [
    ["Data", p.event_date ? new Date(p.event_date + "T12:00:00").toLocaleDateString("pt-BR") : "—"],
    ["Local", p.venue_name || "—"],
    ["Horário", `${p.event_start_time || ""} — ${p.event_end_time || ""}`],
    ["Convidados", String(p.guest_count ?? "—")],
    ["Duração", p.duration_label || "—"],
    ["Consultor", p.created_by || "—"],
  ]);

  const plans = p.pricing_plans || [];
  if (plans.length) {
    h2(c, "Planos de investimento");
    row(c, ["Plano", "Descrição", "Valor"], [130, 260, CW - 390], { bold: true, muted: true });
    divider(c);
    plans.forEach((pl: any) => row(c, [pl.label || "", pl.description || "", BRL(pl.total || 0)], [130, 260, CW - 390]));
    c.y += 8;
  }

  const fixed = packages.filter(pk => !pk.is_optional && pk.category !== "extra");
  const optional = packages.filter(pk => pk.is_optional || pk.category === "extra");

  const renderPkgs = (list: any[], title: string) => {
    if (!list.length) return;
    h2(c, title);
    list.forEach(pk => {
      ensure(c, 40);
      row(c, [pk.name, pk.is_courtesy ? "Cortesia" : BRL(pk.sale_price || 0)], [CW - 120, 120], { bold: true });
      if (pk.description) para(c, pk.description, 8.5, GREY);
      itemsOf(items, pk.id).forEach(it => {
        row(c, [`   • ${it.quantity > 1 ? `${it.quantity}× ` : ""}${it.name}${it.is_courtesy ? " (cortesia)" : ""}`, ""], [CW - 120, 120], { muted: true });
      });
      c.y += 6;
      divider(c);
    });
  };

  renderPkgs(fixed, "Serviços e pacotes inclusos");
  renderPkgs(optional, "Opcionais e adicionais");

  const standalone = itemsOf(items, null);
  if (standalone.length) {
    h2(c, "Itens avulsos opcionais");
    row(c, ["Serviço", "Qtd", "Valor"], [CW - 180, 60, 120], { bold: true, muted: true });
    divider(c);
    standalone.forEach(it => row(c, [
      it.name, String(it.quantity || 1),
      it.is_courtesy ? "Cortesia" : BRL((Number(it.unit_price) || 0) * (Number(it.quantity) || 1)),
    ], [CW - 180, 60, 120]));
  }

  const fixedTotal = fixed.reduce((s, pk) => s + (pk.is_courtesy ? 0 : Number(pk.sale_price) || 0), 0);
  if (fixedTotal > 0) totalBox(c, "Total dos serviços fixos", BRL(fixedTotal));

  if (p.accepted_at) {
    h2(c, "Aceite do cliente");
    const ap = p.accepted_plan || {};
    kv(c, [
      ["Aceito em", new Date(p.accepted_at).toLocaleString("pt-BR")],
      ["Condição", p.accepted_payment_method || "—"],
      ["Formas", (p.accepted_payment_types || []).join(", ") || "—"],
      ["Valor final", BRL(ap.final_value || p.contract_value || 0)],
    ]);
    if (p.accepted_notes) para(c, `Observações: ${p.accepted_notes}`, 9, GREY);
  }

  h2(c, "Contato");
  para(c, `WhatsApp: ${p.whatsapp_number || "5527999936682"}`, 9.5);
  para(c, `Proposta online: ${window.location.origin}/proposta/${p.slug}`, 9.5, GREY);

  footer(c);
  return c.doc;
};

export const buildInternalPdf = (data: PdfData) => {
  const { proposal: p, packages, items, checklist = [], internal } = data;
  const c = newDoc(`Interno ${p.bride_name} & ${p.groom_name}`);
  header(c, p, "Documento interno — não enviar ao cliente");

  const itemsCost = (pkgId: string | null) =>
    itemsOf(items, pkgId).reduce((s, i) => s + (Number(i.unit_cost) || 0) * (Number(i.quantity) || 1), 0);

  h2(c, "Custos por pacote");
  row(c, ["Pacote", "Custo", "Venda", "Margem"], [CW - 300, 100, 100, 100], { bold: true, muted: true });
  divider(c);
  let totalCost = 0, totalPrice = 0;
  packages.forEach(pk => {
    const cost = (Number(pk.internal_cost) || 0) + itemsCost(pk.id);
    const price = pk.is_courtesy ? 0 : Number(pk.sale_price) || 0;
    totalCost += cost;
    if (!pk.is_optional) totalPrice += price;
    row(c, [pk.name, BRL(cost), BRL(price), BRL(price - cost)], [CW - 300, 100, 100, 100]);
    itemsOf(items, pk.id).forEach(it => row(c, [
      `   • ${it.quantity > 1 ? `${it.quantity}× ` : ""}${it.name}`,
      BRL((Number(it.unit_cost) || 0) * (Number(it.quantity) || 1)),
      it.is_courtesy ? "Cortesia" : BRL((Number(it.unit_price) || 0) * (Number(it.quantity) || 1)),
      "",
    ], [CW - 300, 100, 100, 100], { muted: true }));
  });
  const loose = itemsOf(items, null);
  if (loose.length) {
    divider(c);
    loose.forEach(it => {
      const cst = (Number(it.unit_cost) || 0) * (Number(it.quantity) || 1);
      totalCost += cst;
      row(c, [`Avulso: ${it.name}`, BRL(cst), it.is_courtesy ? "Cortesia" : BRL((Number(it.unit_price) || 0) * (Number(it.quantity) || 1)), ""], [CW - 300, 100, 100, 100]);
    });
  }

  c.y += 8;
  const margin = totalPrice - totalCost;
  const pct = totalPrice > 0 ? (margin / totalPrice) * 100 : 0;
  totalBox(c, `Custo ${BRL(totalCost)} · Venda ${BRL(totalPrice)} · Margem`, `${BRL(margin)} (${pct.toFixed(0)}%)`,
    margin >= 0 ? GOLD : [190, 60, 60]);

  h2(c, "Checklist interno");
  if (!checklist.length) para(c, "Nenhum item cadastrado.", 9, GREY);
  else {
    row(c, ["Item", "Categoria", "Qtd", "Status"], [CW - 280, 110, 60, 110], { bold: true, muted: true });
    divider(c);
    checklist.forEach(i => row(c, [i.item, i.category, String(i.quantity || 1), i.status], [CW - 280, 110, 60, 110]));
  }

  h2(c, "Contrato interno");
  if (!internal) para(c, "Nenhum contrato interno cadastrado.", 9, GREY);
  else {
    kv(c, [
      ["Fechado por", internal.closed_by || "—"],
      ["Executado por", internal.executed_by || "—"],
      ["Responsável técnico", internal.technical_lead || "—"],
      ["Valor do contrato", BRL(p.contract_value || 0)],
    ]);
    const split = (internal.revenue_split || []) as any[];
    if (split.length) {
      row(c, ["Pessoa", "Função", "Repasse"], [CW - 260, 140, 120], { bold: true, muted: true });
      divider(c);
      split.forEach(s => row(c, [s.name || "—", s.role || "—", BRL(s.amount || 0)], [CW - 260, 140, 120]));
      const paid = split.reduce((s, r) => s + (Number(r.amount) || 0), 0);
      row(c, ["Total de repasses", "", BRL(paid)], [CW - 260, 140, 120], { bold: true });
      row(c, ["Saldo Home Music", "", BRL((Number(p.contract_value) || 0) - paid)], [CW - 260, 140, 120], { bold: true });
    }
    if (internal.terms) { h2(c, "Termos internos"); para(c, internal.terms, 9); }
  }

  footer(c);
  return c.doc;
};

export const pdfFileName = (p: any, kind: "cliente" | "interno") =>
  `proposta-${p.slug || "home-music"}-${kind}.pdf`;
