import type { Usuario } from "./usuario.types";

export type LoginDto = {
  email: string;
  senha: string;
};

export type CadastroUsuarioDto = {
  nome: string;
  email: string;
  senha: string;
};

export type RespostaLogin = {
  access_token?: string;
  accessToken?: string;
  token?: string;
  usuario?: Usuario;
};

export type AlterarSenhaDto = {
  currentPassword: string;
  newPassword: string;
};
