import type { ParametrosPaginacao } from "./api.types";
import type { Plataforma, TipoConteudo } from "./dominio.types";

export type OrdenacaoRankingConteudos =
  | "viral"
  | "views"
  | "engajamento"
  | "recente";

export type OrdenacaoRankingInfluenciadores =
  | "seguidores"
  | "visualizacoes"
  | "conteudos"
  | "engajamento";

export type FiltrosRankingConteudos = ParametrosPaginacao & {
  plataforma?: Plataforma;
  tipoConteudo?: TipoConteudo;
  nicho?: string;
  busca?: string;
  ordenarPor?: OrdenacaoRankingConteudos;
};

export type FiltrosRankingInfluenciadores = ParametrosPaginacao & {
  plataforma?: Plataforma;
  nicho?: string;
  busca?: string;
  ordenarPor?: OrdenacaoRankingInfluenciadores;
};

export type RankingConteudo = {
  id: string;
  titulo: string;
  plataforma: Plataforma;
  tipoConteudo: TipoConteudo;

  thumbnailUrl?: string | null;
  urlOriginal?: string | null;

  nomeCriador?: string | null;
  usernameCriador?: string | null;

  nicho?: string | null;

  visualizacoes?: number | null;
  curtidas?: number | null;
  comentarios?: number | null;
  compartilhamentos?: number | null;
  taxaEngajamento?: number | null;

  publicadoEm?: string | null;
};

export type RankingInfluenciador = {
  id: string;
  nome: string;
  username?: string | null;
  imagemUrl?: string | null;
  plataforma?: Plataforma;
  nicho?: string;
  seguidores?: number;
  visualizacoes?: number;
  quantidadeConteudos?: number;
  taxaEngajamento?: number;

  mediaVisualizacoesPorConteudo?: number | null;
  crescimentoPercentual?: number | null;
};
