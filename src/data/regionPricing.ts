export type RegionKey = "gv" | "fora";

export const REGIONS: { key: RegionKey; label: string; short: string }[] = [
  { key: "gv", label: "Grande Vitória", short: "GV" },
  { key: "fora", label: "Fora da Grande Vitória", short: "Fora" },
];

export interface PriceBand {
  role: string;
  costMin: number;
  costMax: number;
  priceMin: number;
  priceMax: number;
}

// Faixas de referência internas (custo do profissional x preço sugerido de venda)
export const PRICE_BANDS: Record<RegionKey, PriceBand[]> = {
  gv: [
    { role: "Músico / instrumentista", costMin: 450, costMax: 650, priceMin: 900, priceMax: 1300 },
    { role: "Cantor(a) principal", costMin: 700, costMax: 1000, priceMin: 1400, priceMax: 2000 },
    { role: "Técnico de som", costMin: 400, costMax: 600, priceMin: 800, priceMax: 1200 },
    { role: "DJ", costMin: 900, costMax: 1500, priceMin: 1800, priceMax: 3000 },
    { role: "Sonorização (kit)", costMin: 800, costMax: 1600, priceMin: 1600, priceMax: 3200 },
    { role: "Iluminação cênica", costMin: 900, costMax: 1800, priceMin: 1800, priceMax: 3600 },
  ],
  fora: [
    { role: "Músico / instrumentista", costMin: 700, costMax: 1000, priceMin: 1400, priceMax: 2000 },
    { role: "Cantor(a) principal", costMin: 1000, costMax: 1500, priceMin: 2000, priceMax: 3000 },
    { role: "Técnico de som", costMin: 600, costMax: 900, priceMin: 1200, priceMax: 1800 },
    { role: "DJ", costMin: 1300, costMax: 2000, priceMin: 2600, priceMax: 4000 },
    { role: "Sonorização (kit)", costMin: 1200, costMax: 2200, priceMin: 2400, priceMax: 4400 },
    { role: "Iluminação cênica", costMin: 1300, costMax: 2400, priceMin: 2600, priceMax: 4800 },
  ],
};

export const ITEM_CATEGORIES = [
  { value: "artista", label: "Artista / Músico" },
  { value: "tecnico", label: "Equipe técnica" },
  { value: "equipamento", label: "Equipamento" },
  { value: "estrutura", label: "Estrutura" },
  { value: "logistica", label: "Logística / Deslocamento" },
  { value: "servico", label: "Serviço" },
];

export const PACKAGE_CATEGORIES = [
  { value: "cerimonia", label: "Cerimônia" },
  { value: "recepcao", label: "Recepção" },
  { value: "festa", label: "Festa" },
  { value: "extra", label: "Extra / Opcional" },
];

export const CHECKLIST_CATEGORIES = [
  { value: "tecnico", label: "Técnico" },
  { value: "artistico", label: "Artístico" },
  { value: "estrutura", label: "Estrutura" },
  { value: "logistica", label: "Logística" },
];

export const formatBRL = (val: number) =>
  `R$ ${(Number(val) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
