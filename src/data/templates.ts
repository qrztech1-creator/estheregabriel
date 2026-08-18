export type TemplateKey = "classic" | "noir" | "aurora";

export interface TemplateDef {
  key: TemplateKey;
  label: string;
  description: string;
  /** CSS custom property overrides applied to the proposal page wrapper */
  vars: Record<string, string>;
  /** class that drives the animation personality */
  motionClass: string;
}

export const TEMPLATES: TemplateDef[] = [
  {
    key: "classic",
    label: "Home Music (padrão)",
    description: "Preto absoluto com dourado, cinemática 3D e transições de traço para preenchido.",
    vars: {},
    motionClass: "tpl-classic",
  },
  {
    key: "noir",
    label: "Noir Editorial",
    description: "Alto contraste preto e creme, tipografia editorial e revelações por máscara.",
    vars: {
      "--background": "30 8% 7%",
      "--foreground": "40 30% 92%",
      "--card": "30 8% 10%",
      "--card-foreground": "40 30% 92%",
      "--primary": "38 35% 84%",
      "--primary-foreground": "30 10% 8%",
      "--secondary": "30 6% 14%",
      "--muted": "30 6% 14%",
      "--muted-foreground": "36 12% 62%",
      "--border": "36 12% 26%",
      "--accent": "38 35% 84%",
      "--ring": "38 35% 84%",
    },
    motionClass: "tpl-noir",
  },
  {
    key: "aurora",
    label: "Aurora Neon",
    description: "Azul profundo com violeta luminoso, partículas fluidas e paralaxe suave.",
    vars: {
      "--background": "235 45% 6%",
      "--foreground": "220 40% 96%",
      "--card": "235 40% 10%",
      "--card-foreground": "220 40% 96%",
      "--primary": "265 85% 70%",
      "--primary-foreground": "235 45% 6%",
      "--secondary": "235 35% 14%",
      "--muted": "235 35% 14%",
      "--muted-foreground": "225 20% 68%",
      "--border": "260 40% 30%",
      "--accent": "190 90% 60%",
      "--ring": "265 85% 70%",
    },
    motionClass: "tpl-aurora",
  },
];

export const getTemplate = (key?: string | null): TemplateDef =>
  TEMPLATES.find(t => t.key === key) || TEMPLATES[0];

/** Per-proposal theme overrides stored in proposals.theme */
export interface ProposalTheme {
  background?: string;   // hsl triplet, e.g. "0 0% 4%"
  foreground?: string;
  primary?: string;
  hero_image_url?: string;
  gallery_image_urls?: string[];
}

export const SECTION_KEYS = [
  "hero", "timeline", "songs", "process", "pricing", "optionals", "gallery",
] as const;
export type SectionKey = typeof SECTION_KEYS[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Abertura (Hero)",
  timeline: "Linha do tempo do evento",
  songs: "Repertório / Músicas",
  process: "Do Sim ao Palco",
  pricing: "Investimento",
  optionals: "Opcionais e Adicionais",
  gallery: "Galeria de fotos",
};

export const normalizeSectionOrder = (order: unknown): SectionKey[] => {
  const arr = Array.isArray(order) ? (order as string[]) : [];
  const valid = arr.filter(k => (SECTION_KEYS as readonly string[]).includes(k)) as SectionKey[];
  const missing = SECTION_KEYS.filter(k => !valid.includes(k));
  return [...valid, ...missing];
};

/** Builds the inline style object for a template + theme combo */
export const buildThemeStyle = (templateKey?: string | null, theme?: ProposalTheme | null) => {
  const tpl = getTemplate(templateKey);
  const style: Record<string, string> = { ...tpl.vars };
  if (theme?.background) style["--background"] = theme.background;
  if (theme?.foreground) style["--foreground"] = theme.foreground;
  if (theme?.primary) {
    style["--primary"] = theme.primary;
    style["--accent"] = theme.primary;
    style["--ring"] = theme.primary;
  }
  return style as React.CSSProperties;
};
