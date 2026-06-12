import type {
  RankingConteudo,
  RankingInfluenciador,
} from "@/app/types/ranking.types";

export type RespostaRankingBackend<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
  lastPage?: number;
};

export type RankingConteudoBackend = {
  id: string;
  titulo: string;
  descricao?: string | null;
  plataforma: RankingConteudo["plataforma"];
  tipoConteudo: RankingConteudo["tipoConteudo"];
  urlConteudo?: string | null;
  urlThumbnail?: string | null;
  totalViews?: number | null;
  totalLikes?: number | null;
  totalComentarios?: number | null;
  taxaEngajamento?: number | null;
  publicadoEm?: string | null;
  perfilSocial?: {
    id?: string;
    nomeUsuario?: string | null;
    urlPerfil?: string | null;
  } | null;
  influenciador?: {
    id?: string;
    nome?: string | null;
    imagemUrl?: string | null;
  } | null;
  nicho?: {
    id?: string;
    nome?: string | null;
    slug?: string | null;
  } | null;
};

export type RankingInfluenciadorBackend = {
  posicao?: number;
  perfilSocialId: string;
  influenciadorId?: string | null;
  nome?: string | null;
  descricao?: string | null;
  imagemUrl?: string | null;
  plataforma?: RankingInfluenciador["plataforma"];
  identificadorExterno?: string | null;
  nomeUsuario?: string | null;
  urlPerfil?: string | null;
  totalSeguidores?: number | null;
  totalVisualizacoes?: number | null;
  totalConteudos?: number | null;
  mediaViewsPorConteudo?: number | null;
  mediaEngajamento?: number | null;
  ultimaSincronizacaoEm?: string | null;
  nicho?: {
    id?: string;
    nome?: string | null;
    slug?: string | null;
  } | null;
};
