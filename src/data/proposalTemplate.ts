export const proposalTemplate = {
  event_start_time: "18:00",
  event_end_time: "22:00",
  guest_count: 150,
  duration_label: "4 Horas de Música Imersiva",
  whatsapp_number: "5527999936682",
  pricing_plans: [
    {
      id: "banda-2h",
      label: "Banda 2h",
      description: "Show ao vivo 2h + música ambiente no restante",
      service_count: 1,
      total: 8532,
      entry30: 8190.72, savings30: 341.28,
      entry50: 7678.80, savings50: 853.20,
      aVista: 7465.50, savingsAVista: 1066.50,
      recommended: false,
    },
    {
      id: "banda-2h-dj-2h",
      label: "Banda 2h + DJ 2h",
      description: "Show ao vivo 2h + DJ com playlist personalizada 2h",
      service_count: 2,
      total: 9480,
      entry30: 8974.50, savings30: 505.50,
      entry50: 8498.53, savings50: 981.47,
      aVista: 8295.00, savingsAVista: 1185.00,
      recommended: false,
    },
    {
      id: "banda-2h-dj-3h",
      label: "Banda 2h + DJ 3h",
      description: "Show ao vivo 2h + DJ com playlist personalizada 3h",
      service_count: 2,
      total: 10353,
      entry30: 9938.88, savings30: 414.12,
      entry50: 9317.70, savings50: 1035.30,
      aVista: 9058.88, savingsAVista: 1294.12,
      recommended: false,
    },
    {
      id: "banda-3h-dj-2h",
      label: "Banda 3h + DJ 2h",
      description: "Show ao vivo 3h + DJ com playlist personalizada 2h",
      service_count: 2,
      total: 11984,
      entry30: 11504.64, savings30: 479.36,
      entry50: 10785.60, savings50: 1198.40,
      aVista: 10486.00, savingsAVista: 1498.00,
      recommended: true,
    },
  ],
  included_services: [
    { icon: "Music", text: "Show ao vivo da banda — 2 horas" },
    { icon: "Disc3", text: "DJ com playlist personalizada — 2 horas" },
    { icon: "Lightbulb", text: "Iluminação cênica para o palco", badge: "Cortesia" },
    { icon: "Volume2", text: "Sonorização completa para 150 convidados" },
  ],
  tech_details: [
    "Mesa de som digital",
    "Caixas ativas de alta potência",
    "Subwoofers",
    "Cabeamento completo",
    "Microfones profissionais",
    "Logística de montagem e desmontagem",
    "Suporte técnico durante o evento",
  ],
  event_timeline: [
    {
      time: "18:00",
      duration: "30 min",
      title: "DJ Abre a Noite",
      description: "A energia começa antes do primeiro brinde. Sons escolhidos a dedo por vocês criam o clima perfeito enquanto os convidados chegam.",
      icon: "Radio",
      details: ["Playlist personalizada pelos noivos", "Ambiente lounge que já dá vontade de dançar", "Transição cinematográfica para a banda"],
    },
    {
      time: "18:30",
      duration: "2 horas",
      title: "Banda ao Vivo — O Ápice",
      description: "16 blocos musicais. Do rock alternativo ao pop, do nacional ao internacional. Cada nota pensada para manter a pista lotada e a energia sempre subindo.",
      icon: "Music",
      details: ["The Killers, Arctic Monkeys, Paramore, NX Zero", "Bruno Mars, Michael Jackson", "Medleys explosivos e blocos temáticos"],
    },
    {
      time: "20:30",
      duration: "1h30",
      title: "DJ Fecha com Tudo",
      description: "A energia não para. O DJ assume com a playlist definitiva — montada por vocês — para fechar uma noite que ninguém vai esquecer.",
      icon: "Disc3",
      details: ["Playlist montada pelo casal", "Hits que fazem todo mundo cantar junto", "Energia máxima até o último segundo"],
    },
  ],
  process_steps: [
    { icon: "CheckCircle2", title: "Fechamento do Contrato", date: "Mês 1", description: "Assinatura e entrada. Definição das preferências iniciais de repertório.", active: true },
    { icon: "ListMusic", title: "Definição de Repertório", date: "Mês 2-4", description: "Vocês montam a playlist do DJ e sugerem músicas para a banda. Troca de ideias e refinamentos." },
    { icon: "Users", title: "Reunião de Alinhamento", date: "Mês 6", description: "Encontro para alinhar detalhes finais: setlist, ordem das músicas, momentos especiais." },
    { icon: "Mic2", title: "Ensaio & Preparação", date: "Mês anterior", description: "Banda ensaia o repertório final. Ajustes de última hora no setlist." },
    { icon: "CalendarDays", title: "Passagem de Som", date: "Dia do evento — Manhã", description: "Montagem da estrutura, passagem de som e teste de iluminação no local." },
    { icon: "PartyPopper", title: "O Grande Dia", date: "Dia do evento", description: "Tudo pronto. A noite perfeita começa. Hora de celebrar!" },
  ],
  showcase_songs: [
    { title: "Take on Me", artist: "A-ha", videoId: "djV11Xbc914" },
    { title: "I Don't Want to Miss a Thing", artist: "Aerosmith", videoId: "JkK8g6FMEXE" },
    { title: "Valerie", artist: "Amy Winehouse", videoId: "bixuI_GV5I0" },
    { title: "Do I Wanna Know?", artist: "Arctic Monkeys", videoId: "pqrUQrAcfo4" },
    { title: "Like a Stone", artist: "Audioslave", videoId: "7QU1nvuxaMA" },
    { title: "I Want It That Way", artist: "Backstreet Boys", videoId: "4fndeDfaWCg" },
    { title: "Stayin' Alive", artist: "Bee Gees", videoId: "fNFzfwLM72c" },
    { title: "Stand By Me", artist: "Ben E. King", videoId: "hwZNL7QVJjE" },
    { title: "Livin' on a Prayer", artist: "Bon Jovi", videoId: "lDK9QqIzhwk" },
    { title: "Locked Out of Heaven", artist: "Bruno Mars", videoId: "e-fA-gBCkj0" },
    { title: "Treasure", artist: "Bruno Mars", videoId: "VFmHB5KVe_g" },
    { title: "Uptown Funk", artist: "Bruno Mars", videoId: "OPf0YbXqDm0" },
    { title: "Heaven", artist: "Bryan Adams", videoId: "3eT464L1YRA" },
    { title: "Ela Vai Voltar", artist: "Charlie Brown Jr.", videoId: "PBBmhJkMYWI" },
    { title: "Lutar Pelo Que É Meu", artist: "Charlie Brown Jr.", videoId: "iUaHMOWRjkI" },
    { title: "Pontes Indestrutíveis", artist: "Charlie Brown Jr.", videoId: "T7XAOQ6k8YE" },
    { title: "Zóio de Lula", artist: "Charlie Brown Jr.", videoId: "BhEXEDAja28" },
    { title: "Have You Ever Seen the Rain?", artist: "Creedence", videoId: "u1V8YRJnr4Q" },
    { title: "Get Lucky", artist: "Daft Punk", videoId: "5NV6Rdv1a3I" },
    { title: "Sweet Child O' Mine", artist: "Guns N' Roses", videoId: "1w7OgIMMRc4" },
    { title: "As It Was", artist: "Harry Styles", videoId: "H5v3kku4y6Q" },
    { title: "Don't Stop Believin'", artist: "Journey", videoId: "1k8craCGpgs" },
    { title: "Use Somebody", artist: "Kings of Leon", videoId: "gnhXHvRoUd0" },
    { title: "In the End", artist: "Linkin Park", videoId: "eVTXPUF4Oz4" },
    { title: "She Got the Best of Me", artist: "Luke Combs", videoId: "sD3kO4U5Oh4" },
    { title: "Love Never Felt So Good", artist: "Michael Jackson", videoId: "oG08ukJPtR8" },
    { title: "Cedo ou Tarde", artist: "NX Zero", videoId: "XdglM81b4g8" },
    { title: "Razões e Emoções", artist: "NX Zero", videoId: "7KbY8QT0CGI" },
    { title: "Wonderwall", artist: "Oasis", videoId: "6hzrDeceEKc" },
    { title: "Decode", artist: "Paramore", videoId: "RvnkAtWcKYg" },
    { title: "Playing God", artist: "Paramore", videoId: "iDy2wCQYSrU" },
    { title: "Still Into You", artist: "Paramore", videoId: "OblL026SvD4" },
    { title: "That's What You Get", artist: "Paramore", videoId: "1kz6hNDlEEg" },
    { title: "Bless the Broken Road", artist: "Rascal Flatts", videoId: "I_yO3m-WcbY" },
    { title: "Life Is a Highway", artist: "Rascal Flatts", videoId: "5tXh_MfrMe0" },
    { title: "What Hurts the Most", artist: "Rascal Flatts", videoId: "7qH4qyi1-Ys" },
    { title: "Californication", artist: "Red Hot Chili Peppers", videoId: "YlUKcNNmywk" },
    { title: "Everybody Wants to Rule the World", artist: "Tears for Fears", videoId: "aGCdLKXNF3w" },
    { title: "Mr. Brightside", artist: "The Killers", videoId: "j8tZs6G_h7U" },
    { title: "Every Breath You Take", artist: "The Police", videoId: "OMOGaugKpzs" },
    { title: "Reptilia", artist: "The Strokes", videoId: "b8-tXG8KrWs" },
    { title: "I'll Be Over You", artist: "Toto", videoId: "r7XhWUDj-Ts" },
  ],
  optional_extras: [
    {
      icon: "Monitor",
      title: "Painel de LED 3×2",
      description: "Tela de LED de alta resolução para exibição de fotos do casal, vídeos, mensagens dos convidados e projeções temáticas durante a festa.",
      details: ["Tamanho personalizado conforme o espaço", "Exibição de fotos e vídeos do casal", "Mensagens em tempo real dos convidados", "Conteúdo visual sincronizado com a música"],
    },
    {
      icon: "Lightbulb",
      title: "Iluminação de Pista",
      description: "Iluminação cênica profissional para a pista de dança com efeitos sincronizados ao ritmo da música, criando a atmosfera perfeita.",
      details: ["Moving heads e spots profissionais", "Efeitos de cor sincronizados com a música", "Iluminação decorativa ambiente", "Operador de luz dedicado durante o evento"],
    },
  ],
  extras_bundle_title: "Pista de dança com iluminação + Tela de LED 3×2",
  extras_bundle_price: 2800,
};

export const generateSlug = (bride: string, groom: string, date: string) => {
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
  const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  return `${normalize(bride)}-${normalize(groom)}-${year}`;
};

export interface PaymentDiscounts {
  entry30: number; // % desconto para entrada de 30
  entry50: number; // % desconto para entrada de 50
  aVista: number;  // % desconto para à vista
  enabled30?: boolean; // exibir opção de entrada 30%
  enabled50?: boolean; // exibir opção de entrada 50%
  enabledAVista?: boolean; // exibir opção à vista
  requireCombo?: boolean; // exigir mais de 1 serviço para liberar desconto
}

export const DEFAULT_PAYMENT_DISCOUNTS: PaymentDiscounts = {
  entry30: 4,
  entry50: 10,
  aVista: 12.5,
  enabled30: true,
  enabled50: true,
  enabledAVista: true,
  requireCombo: true,
};

export const getPlanServiceCount = (plan: any): number => {
  if (typeof plan?.service_count === "number" && plan.service_count > 0) {
    return plan.service_count;
  }
  const text = `${plan?.label || ""} ${plan?.description || ""}`.toLowerCase();
  if (text.includes("+") || text.includes("dj") || text.includes("cerimônia") || text.includes("cerimonia")) {
    return 2;
  }
  return 1;
};

export const getProposalDiscounts = (proposal: any): PaymentDiscounts => {
  const raw = proposal?.theme?.payment_discounts || proposal?.payment_discounts || {};
  const firstPlan = proposal?.pricing_plans?.[0];

  return {
    entry30: typeof raw.entry30 === "number" ? raw.entry30 : (typeof firstPlan?.discount30 === "number" ? firstPlan.discount30 : DEFAULT_PAYMENT_DISCOUNTS.entry30),
    entry50: typeof raw.entry50 === "number" ? raw.entry50 : (typeof firstPlan?.discount50 === "number" ? firstPlan.discount50 : DEFAULT_PAYMENT_DISCOUNTS.entry50),
    aVista: typeof raw.aVista === "number" ? raw.aVista : (typeof firstPlan?.discountAVista === "number" ? firstPlan.discountAVista : DEFAULT_PAYMENT_DISCOUNTS.aVista),
    enabled30: raw.enabled30 !== false,
    enabled50: raw.enabled50 !== false,
    enabledAVista: raw.enabledAVista !== false,
    requireCombo: raw.requireCombo !== false,
  };
};

export const recalcPlanDiscounts = (total: number, discounts?: PaymentDiscounts) => {
  const d30 = (discounts?.entry30 ?? DEFAULT_PAYMENT_DISCOUNTS.entry30) / 100;
  const d50 = (discounts?.entry50 ?? DEFAULT_PAYMENT_DISCOUNTS.entry50) / 100;
  const dAV = (discounts?.aVista ?? DEFAULT_PAYMENT_DISCOUNTS.aVista) / 100;

  return {
    discount30: discounts?.entry30 ?? DEFAULT_PAYMENT_DISCOUNTS.entry30,
    discount50: discounts?.entry50 ?? DEFAULT_PAYMENT_DISCOUNTS.entry50,
    discountAVista: discounts?.aVista ?? DEFAULT_PAYMENT_DISCOUNTS.aVista,
    entry30: +(total * (1 - d30)).toFixed(2),
    savings30: +(total * d30).toFixed(2),
    entry50: +(total * (1 - d50)).toFixed(2),
    savings50: +(total * d50).toFixed(2),
    aVista: +(total * (1 - dAV)).toFixed(2),
    savingsAVista: +(total * dAV).toFixed(2),
  };
};
