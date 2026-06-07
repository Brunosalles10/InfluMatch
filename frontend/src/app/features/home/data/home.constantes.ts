import {
  BarChart3,
  BrainCircuit,
  LineChart,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type OpcaoNichoHome = {
  label: string;
  value: string;
};

export type EstatisticaHome = {
  titulo: string;
  valor: string;
  descricao: string;
  Icone: LucideIcon;
};

export type BeneficioHome = {
  titulo: string;
  descricao: string;
  Icone: LucideIcon;
};

export const OPCOES_NICHOS_HOME: OpcaoNichoHome[] = [
  { label: "Games", value: "games" },
  { label: "Beleza", value: "beleza" },
  { label: "Fitness", value: "fitness" },
  { label: "Culinária", value: "culinaria" },
  { label: "Tech", value: "tech" },
  { label: "Viagens", value: "viagens" },
];

export const ESTATISTICAS_HOME: EstatisticaHome[] = [
  {
    titulo: "Criadores analisados",
    valor: "2.5M+",
    descricao: "Perfis mapeados por nicho e plataforma",
    Icone: Users,
  },
  {
    titulo: "Conteúdos monitorados",
    valor: "10M+",
    descricao: "Vídeos, shorts, posts e reels",
    Icone: BarChart3,
  },
  {
    titulo: "Nichos rastreados",
    valor: "150+",
    descricao: "Segmentações para campanhas",
    Icone: Target,
  },
  {
    titulo: "Atualização inteligente",
    valor: "24h",
    descricao: "Dados preparados para análise rápida",
    Icone: Zap,
  },
];

export const BENEFICIOS_HOME: BeneficioHome[] = [
  {
    titulo: "Busca por nicho",
    descricao:
      "Encontre criadores segmentados por categorias como games, tecnologia, beleza, fitness e muito mais.",
    Icone: Search,
  },
  {
    titulo: "Análise de engajamento",
    descricao:
      "Compare criadores e conteúdos usando métricas como visualizações, curtidas, comentários e taxa de engajamento.",
    Icone: LineChart,
  },
  {
    titulo: "Dados centralizados",
    descricao:
      "Organize influenciadores, perfis sociais e conteúdos em uma base preparada para múltiplas plataformas.",
    Icone: BrainCircuit,
  },
  {
    titulo: "Ranking de tendências",
    descricao:
      "Visualize conteúdos virais e criadores em alta para apoiar decisões de marketing de influência.",
    Icone: TrendingUp,
  },
  {
    titulo: "Arquitetura escalável",
    descricao:
      "Sistema preparado para evoluir com novas integrações como Instagram e TikTok em versões futuras.",
    Icone: Sparkles,
  },
  {
    titulo: "Controle administrativo",
    descricao:
      "A coleta de dados fica restrita ao administrador, mantendo controle sobre consumo de APIs externas.",
    Icone: ShieldCheck,
  },
];
