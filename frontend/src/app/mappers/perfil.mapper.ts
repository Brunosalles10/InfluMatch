import type { DadosAtualizarPerfil } from "@/app/schemas";
import type { AtualizarMinhaContaDto } from "@/app/services/usuarios/usuariosService";

export function mapearAtualizarPerfilParaDto(
  dados: DadosAtualizarPerfil,
): AtualizarMinhaContaDto {
  return {
    nome: dados.nome,
    email: dados.email,
  };
}
