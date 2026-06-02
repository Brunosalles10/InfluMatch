export type Plataforma = "YOUTUBE" | "INSTAGRAM" | "TIKTOK";

export type TipoConteudo = "VIDEO" | "SHORT" | "POST" | "REEL";

export type Nicho = {
  id: string;
  nome: string;
  slug?: string;
  descricao?: string | null;
  criadoEm?: string;
  atualizadoEm?: string;
};

export type Influenciador = {
  id: string;
  nome: string;
  username?: string | null;
  descricao?: string | null;
  imagemUrl?: string | null;
  nicho?: Nicho | null;
  criadoEm?: string;
  atualizadoEm?: string;
};

export type PerfilSocial = {
  id: string;
  plataforma: Plataforma;
  username?: string | null;
  urlPerfil?: string | null;
  quantidadeSeguidores?: number;
  quantidadeVisualizacoes?: number;
  influenciadorId?: string;
};

export type Conteudo = {
  id: string;
  titulo: string;
  descricao?: string | null;
  urlOriginal?: string | null;
  thumbnailUrl?: string | null;
  plataforma: Plataforma;
  tipoConteudo: TipoConteudo;
  quantidadeVisualizacoes?: number;
  quantidadeCurtidas?: number;
  quantidadeComentarios?: number;
  quantidadeCompartilhamentos?: number;
  taxaEngajamento?: number;
  publicadoEm?: string | null;
  influenciador?: Influenciador | null;
  nicho?: Nicho | null;
};
