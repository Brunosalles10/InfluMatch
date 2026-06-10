export type TipoAcaoPlano = "CADASTRO" | "PLACEHOLDER";

export type PlanoPreco = {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  periodo: string;
  destaque?: boolean;
  selo?: string;
  textoBotao: string;
  tipoAcao: TipoAcaoPlano;
  recursos: string[];
};

export const PLANOS_PRECOS: PlanoPreco[] = [
  {
    id: "gratis",
    nome: "Grátis",
    descricao: "Ideal para conhecer a plataforma e explorar rankings iniciais.",
    preco: "R$ 0",
    periodo: "/mês",
    textoBotao: "Começar Grátis",
    tipoAcao: "CADASTRO",
    recursos: [
      "Acesso aos rankings públicos",
      "Busca por criadores e conteúdos",
      "Filtros básicos por nicho",
      "Visualização de métricas principais",
      "Projeto adequado para apresentação inicial",
    ],
  },
  {
    id: "pro",
    nome: "Pro",
    descricao:
      "Planejado para usuários que precisam de análises mais completas.",
    preco: "Futuro",
    periodo: "",
    destaque: true,
    selo: "Planejado",
    textoBotao: "Assinar Pro",
    tipoAcao: "PLACEHOLDER",
    recursos: [
      "Filtros avançados por plataforma",
      "Relatórios de campanhas",
      "Comparação entre criadores",
      "Histórico de crescimento",
      "Exportação de dados",
    ],
  },
  {
    id: "enterprise",
    nome: "Enterprise",
    descricao: "Planejado para empresas, agências e times de marketing.",
    preco: "Sob consulta",
    periodo: "",
    textoBotao: "Falar com Vendas",
    tipoAcao: "PLACEHOLDER",
    recursos: [
      "Painel corporativo",
      "Gestão de múltiplas campanhas",
      "Permissões por equipe",
      "Integrações personalizadas",
      "Suporte prioritário",
    ],
  },
];
