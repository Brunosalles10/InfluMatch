import type { Usuario } from "./usuario.types";

export type LoginDto = {
  email: string;
  password: string;
};

export type CadastroUsuarioDto = {
  nome: string;
  email: string;
  password: string;
};

export type RespostaLogin = {
  access_token?: string;
  accessToken?: string;
  token?: string;
  user?: Usuario;
  usuario?: Usuario;
};

export type AlterarSenhaDto = {
  currentPassword: string;
  newPassword: string;
};
