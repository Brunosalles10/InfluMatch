export class ErroApi extends Error {
  public readonly statusCode?: number;
  public readonly mensagens: string[];

  constructor(mensagem: string, statusCode?: number, mensagens?: string[]) {
    super(mensagem);

    this.name = "ErroApi";
    this.statusCode = statusCode;
    this.mensagens = mensagens ?? [mensagem];
  }
}
