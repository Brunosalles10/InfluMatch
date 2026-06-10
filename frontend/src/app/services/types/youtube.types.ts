export type ColetarYoutubeDto = {
  nicho: string;
  quantidadeResultados: number;
};

export type ResumoColetaYoutube = {
  nicho?: string;
  plataforma?: "YOUTUBE";

  videosEncontrados?: number;
  canaisProcessados?: number;

  influenciadoresCriados?: number;
  influenciadoresAtualizados?: number;

  perfisSociaisCriados?: number;
  perfisSociaisAtualizados?: number;

  conteudosCriados?: number;
  conteudosAtualizados?: number;

  erros?: string[];
  mensagem?: string;

  [chave: string]: unknown;
};
