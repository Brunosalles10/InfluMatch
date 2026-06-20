export type TipoDocumentoContato = "CPF" | "CNPJ";

export type ValidarContatoComercialDto = {
  nome: string;
  email: string;
  telefone: string;
  tipoDocumento: TipoDocumentoContato;
  documento: string;
  cep: string;
  dataPrevista: string;
  mensagem: string;
};

export type ContatoComercialValidado = {
  mensagem: string;
  protocolo: string;
  validadoEm: string;
};
