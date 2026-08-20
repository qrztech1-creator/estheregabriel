import type { RegionKey } from "./regionPricing";

export interface PresetItem {
  name: string;
  category: string;
  quantity: number;
  unit_cost: number;
  unit_price: number;
}

export interface PackagePreset {
  key: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  is_optional?: boolean;
  items: PresetItem[];
}

/**
 * Sugestões de pacotes (apenas ponto de partida — tudo editável na criação).
 * Os valores mudam conforme a região do evento (dentro/fora da Grande Vitória).
 */
const build = (region: RegionKey): PackagePreset[] => {
  const fora = region === "fora";
  // multiplicadores de referência para fora da Grande Vitória (deslocamento/hospedagem)
  const c = (gv: number, f: number) => (fora ? f : gv);

  const logistica: PresetItem[] = fora
    ? [{ name: "Deslocamento e hospedagem da equipe", category: "logistica", quantity: 1, unit_cost: 900, unit_price: 1400 }]
    : [];

  return [
    {
      key: "cerimonia-trio",
      name: "Cerimônia — Trio",
      category: "cerimonia",
      description: "Trio instrumental com voz para a cerimônia, com sonorização própria e ensaio de repertório personalizado.",
      tags: ["Cerimônia", "3 músicos"],
      items: [
        { name: "Cantor(a) principal", category: "artista", quantity: 1, unit_cost: c(800, 1200), unit_price: c(1600, 2400) },
        { name: "Violino", category: "artista", quantity: 1, unit_cost: c(550, 850), unit_price: c(1100, 1700) },
        { name: "Violão / Teclado", category: "artista", quantity: 1, unit_cost: c(550, 850), unit_price: c(1100, 1700) },
        { name: "Técnico de som", category: "tecnico", quantity: 1, unit_cost: c(500, 750), unit_price: c(1000, 1500) },
        { name: "Sonorização cerimônia (kit)", category: "equipamento", quantity: 1, unit_cost: c(1000, 1600), unit_price: c(2000, 3200) },
        ...logistica,
      ],
    },
    {
      key: "cerimonia-solo",
      name: "Cerimônia — Voz e Violão",
      category: "cerimonia",
      description: "Formato intimista com voz e violão, ideal para cerimônias ao ar livre e pequenas.",
      tags: ["Cerimônia", "Enxuto"],
      items: [
        { name: "Cantor(a) principal", category: "artista", quantity: 1, unit_cost: c(750, 1100), unit_price: c(1500, 2200) },
        { name: "Violonista", category: "artista", quantity: 1, unit_cost: c(500, 800), unit_price: c(1000, 1600) },
        { name: "Sonorização compacta", category: "equipamento", quantity: 1, unit_cost: c(800, 1300), unit_price: c(1600, 2600) },
        ...logistica,
      ],
    },
    {
      key: "recepcao-jazz",
      name: "Recepção — Jazz Lounge",
      category: "recepcao",
      description: "Trio de jazz para o coquetel de recepção, criando clima sofisticado enquanto os convidados chegam.",
      tags: ["Recepção", "Coquetel"],
      items: [
        { name: "Voz jazz", category: "artista", quantity: 1, unit_cost: c(750, 1100), unit_price: c(1500, 2200) },
        { name: "Sax / Trompete", category: "artista", quantity: 1, unit_cost: c(550, 850), unit_price: c(1100, 1700) },
        { name: "Teclado", category: "artista", quantity: 1, unit_cost: c(550, 850), unit_price: c(1100, 1700) },
        { name: "Sonorização recepção", category: "equipamento", quantity: 1, unit_cost: c(700, 1200), unit_price: c(1400, 2400) },
        ...logistica,
      ],
    },
    {
      key: "festa-banda",
      name: "Festa — Banda Completa",
      category: "festa",
      description: "Banda completa com DJ integrado, sonorização e iluminação cênica para a pista de dança.",
      tags: ["Festa", "Banda + DJ"],
      items: [
        { name: "Cantor(a) principal", category: "artista", quantity: 1, unit_cost: c(900, 1400), unit_price: c(1800, 2800) },
        { name: "Backing vocal", category: "artista", quantity: 1, unit_cost: c(550, 850), unit_price: c(1100, 1700) },
        { name: "Guitarra", category: "artista", quantity: 1, unit_cost: c(550, 850), unit_price: c(1100, 1700) },
        { name: "Baixo", category: "artista", quantity: 1, unit_cost: c(550, 850), unit_price: c(1100, 1700) },
        { name: "Bateria", category: "artista", quantity: 1, unit_cost: c(550, 850), unit_price: c(1100, 1700) },
        { name: "DJ", category: "artista", quantity: 1, unit_cost: c(1100, 1650), unit_price: c(2200, 3300) },
        { name: "Técnico de som", category: "tecnico", quantity: 1, unit_cost: c(500, 750), unit_price: c(1000, 1500) },
        { name: "Sonorização festa (kit)", category: "equipamento", quantity: 1, unit_cost: c(1400, 2000), unit_price: c(2800, 4000) },
        { name: "Iluminação cênica", category: "estrutura", quantity: 1, unit_cost: c(1200, 1900), unit_price: c(2400, 3800) },
        ...logistica,
      ],
    },
    {
      key: "festa-dj",
      name: "Festa — DJ + Sonorização",
      category: "festa",
      description: "DJ residente com sonorização e iluminação, formato ágil para festas com pista contínua.",
      tags: ["Festa", "DJ"],
      items: [
        { name: "DJ", category: "artista", quantity: 1, unit_cost: c(1100, 1650), unit_price: c(2200, 3300) },
        { name: "Técnico de som", category: "tecnico", quantity: 1, unit_cost: c(450, 700), unit_price: c(900, 1400) },
        { name: "Sonorização festa (kit)", category: "equipamento", quantity: 1, unit_cost: c(1200, 1800), unit_price: c(2400, 3600) },
        { name: "Iluminação cênica", category: "estrutura", quantity: 1, unit_cost: c(1000, 1700), unit_price: c(2000, 3400) },
        ...logistica,
      ],
    },
    {
      key: "extra-led",
      name: "Painel de LED",
      category: "extra",
      description: "Painel de LED em alta resolução com conteúdo visual sincronizado ao show.",
      tags: ["Opcional"],
      is_optional: true,
      items: [
        { name: "Painel de LED (m²)", category: "estrutura", quantity: 1, unit_cost: c(1400, 2000), unit_price: c(2800, 4000) },
        { name: "Operador de vídeo", category: "tecnico", quantity: 1, unit_cost: c(400, 650), unit_price: c(800, 1300) },
      ],
    },
    {
      key: "extra-pista",
      name: "Pista Espelhada",
      category: "extra",
      description: "Pista de dança espelhada instalada e desmontada pela nossa equipe.",
      tags: ["Opcional"],
      is_optional: true,
      items: [
        { name: "Pista espelhada", category: "estrutura", quantity: 1, unit_cost: c(600, 950), unit_price: c(1200, 1900) },
      ],
    },
    {
      key: "extra-hora",
      name: "Hora Extra de Música",
      category: "extra",
      description: "Prolongamento de uma hora de show com a mesma formação contratada.",
      tags: ["Opcional"],
      is_optional: true,
      items: [
        { name: "Hora extra (equipe completa)", category: "servico", quantity: 1, unit_cost: c(700, 1000), unit_price: c(1500, 2200) },
      ],
    },
  ];
};

export const getPackagePresets = (region: RegionKey) => build(region);

export const presetTotals = (p: PackagePreset) => {
  const cost = p.items.reduce((s, i) => s + i.unit_cost * i.quantity, 0);
  const price = p.items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  return { cost, price, profit: price - cost, marginPct: price > 0 ? ((price - cost) / price) * 100 : 0 };
};
