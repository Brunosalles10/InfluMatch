import type {
  DadosAlterarSenha,
  DadosCadastro,
  DadosLogin,
} from "@/app/schemas";
import type {
  AlterarSenhaDto,
  CadastroUsuarioDto,
  LoginDto,
} from "@/app/types/auth.types";

export function mapearLoginParaDto(dados: DadosLogin): LoginDto {
  return {
    email: dados.email,
    senha: dados.senha,
  };
}

export function mapearCadastroParaDto(
  dados: DadosCadastro,
): CadastroUsuarioDto {
  return {
    nome: dados.nome,
    email: dados.email,
    senha: dados.senha,
  };
}

export function mapearAlterarSenhaParaDto(
  dados: DadosAlterarSenha,
): AlterarSenhaDto {
  return {
    currentPassword: dados.senhaAtual,
    newPassword: dados.novaSenha,
  };
}
