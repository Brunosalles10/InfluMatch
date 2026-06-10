import type { DadosCadastro, DadosLogin } from "@/app/schemas";
import type { Usuario } from "@/app/types/usuario.types";
import { createContext } from "react";

export type AuthContextData = {
  usuario: Usuario | null;
  carregandoUsuario: boolean;
  autenticado: boolean;
  usuarioAdmin: boolean;
  login: (dados: DadosLogin) => Promise<void>;
  cadastrar: (dados: DadosCadastro) => Promise<void>;
  logout: () => void;
  recarregarPerfil: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextData | null>(null);
