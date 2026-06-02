export type RespostaPaginada<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
};

export type ParametrosPaginacao = {
  page?: number;
  limit?: number;
};

export type MensagemErroApi = string | string[];

export type ErroBackend = {
  statusCode?: number;
  message?: MensagemErroApi;
  error?: string;
};
