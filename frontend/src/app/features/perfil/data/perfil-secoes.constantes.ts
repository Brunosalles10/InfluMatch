import {
  AlertTriangle,
  LockKeyhole,
  UserCog,
  type LucideIcon,
} from "lucide-react";

export type SecaoPerfil = "dados" | "senha" | "seguranca";

export type OpcaoSecaoPerfil = {
  id: SecaoPerfil;
  titulo: string;
  descricao: string;
  Icone: LucideIcon;
};

export const SECOES_PERFIL: OpcaoSecaoPerfil[] = [
  {
    id: "dados",
    titulo: "Dados pessoais",
    descricao: "Atualize seu nome e email de acesso.",
    Icone: UserCog,
  },
  {
    id: "senha",
    titulo: "Senha",
    descricao: "Altere sua senha de autenticação.",
    Icone: LockKeyhole,
  },
  {
    id: "seguranca",
    titulo: "Segurança da conta",
    descricao: "Gerencie ações sensíveis da sua conta.",
    Icone: AlertTriangle,
  },
];

export function buscarSecaoPerfil(secaoAtiva: SecaoPerfil) {
  return SECOES_PERFIL.find((secao) => secao.id === secaoAtiva);
}
