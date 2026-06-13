export type RoleUsuario = "ADMIN" | "USER";

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  role: RoleUsuario;
  ativo?: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
};
