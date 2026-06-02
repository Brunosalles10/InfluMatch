export type RoleUsuario = "ADMIN" | "USER";

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  role: RoleUsuario;
  criadoEm?: string;
  atualizadoEm?: string;
};
