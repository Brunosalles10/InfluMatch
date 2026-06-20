export type ColetarYoutubeDto = {
  nicho: string;
  quantidadeResultados: number;
};

export type NichoResumoColetaYoutube = {
  id: string;
  nome: string;
  slug: string;
};

export type ResumoColetaYoutube = {
  mensagem: string;
  plataforma: "YOUTUBE";
  nicho: NichoResumoColetaYoutube;
  totalVideosEncontrados: number;
  totalCanaisProcessados: number;
  totalConteudosProcessados: number;
  retornadoDoCache: boolean;
  atualizadoEm: string;
};
