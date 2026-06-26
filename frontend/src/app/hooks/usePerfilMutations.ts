import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { mapearAlterarSenhaParaDto } from "@/app/mappers/auth.mapper";
import { mapearAtualizarPerfilParaDto } from "@/app/mappers/perfil.mapper";
import type { DadosAlterarSenha, DadosAtualizarPerfil } from "@/app/schemas";
import { ErroApi } from "@/app/services/api/ErroApi";
import { usuariosService } from "@/app/services/usuarios/usuariosService";
import type { Usuario } from "@/app/types/usuario.types";

type UsePerfilMutationsParams = {
  usuario: Usuario | null;
  recarregarPerfil: () => Promise<void>;
  logout: () => void;
};

/**
 * Centraliza as mutations relacionadas ao perfil do usuário autenticado.
 */
export function usePerfilMutations({
  usuario,
  recarregarPerfil,
  logout,
}: UsePerfilMutationsParams) {
  /**
   * Envia a atualização de perfil para a API usando o ID do usuário logado.
   */
  async function executarAtualizacaoPerfil(
    dados: DadosAtualizarPerfil,
  ): Promise<unknown> {
    if (!usuario?.id) {
      throw new Error("Usuário autenticado não encontrado.");
    }

    return usuariosService.atualizarMinhaConta(
      usuario.id,
      mapearAtualizarPerfilParaDto(dados),
    );
  }

  /**
   * Envia a alteração de senha para a API no formato esperado pelo backend.
   */
  function executarAlteracaoSenha(dados: DadosAlterarSenha): Promise<unknown> {
    return usuariosService.alterarMinhaSenha(mapearAlterarSenhaParaDto(dados));
  }

  /**
   * Solicita a exclusão lógica da conta do usuário autenticado.
   */
  function executarExclusaoConta(): Promise<unknown> {
    return usuariosService.deletarMinhaConta();
  }

  /**
   * Atualiza os dados do perfil exibidos no frontend após uma edição bem-sucedida.
   */
  async function tratarAtualizacaoPerfilComSucesso(): Promise<void> {
    await recarregarPerfil();

    toast.success("Perfil atualizado com sucesso.");
  }

  /**
   * Exibe mensagem de sucesso após a senha ser alterada.
   */
  function tratarAlteracaoSenhaComSucesso(): void {
    toast.success("Senha alterada com sucesso.");
  }

  /**
   * Encerra a sessão após a conta ser deletada com sucesso.
   */
  function tratarExclusaoContaComSucesso(): void {
    toast.success("Conta deletada com sucesso.");
    logout();
  }

  /**
   * Exibe uma mensagem amigável quando alguma mutation falha.
   */
  function tratarErroMutation(erro: unknown): void {
    toast.error(obterMensagemErro(erro));
  }

  /**
   * Controla a mutation responsável por atualizar nome/e-mail do perfil.
   */
  const atualizarPerfilMutation = useMutation({
    mutationFn: executarAtualizacaoPerfil,
    onSuccess: tratarAtualizacaoPerfilComSucesso,
    onError: tratarErroMutation,
  });

  /**
   * Controla a mutation responsável por alterar a senha do usuário.
   */
  const alterarSenhaMutation = useMutation({
    mutationFn: executarAlteracaoSenha,
    onSuccess: tratarAlteracaoSenhaComSucesso,
    onError: tratarErroMutation,
  });

  /**
   * Controla a mutation responsável por deletar a conta autenticada.
   */
  const deletarContaMutation = useMutation({
    mutationFn: executarExclusaoConta,
    onSuccess: tratarExclusaoContaComSucesso,
    onError: tratarErroMutation,
  });

  /**
   * Expõe a ação de atualizar perfil para os componentes da tela.
   */
  async function atualizarPerfil(dados: DadosAtualizarPerfil): Promise<void> {
    await atualizarPerfilMutation.mutateAsync(dados);
  }

  /**
   * Expõe a ação de alterar senha para os componentes da tela.
   */
  async function alterarSenha(dados: DadosAlterarSenha): Promise<void> {
    await alterarSenhaMutation.mutateAsync(dados);
  }

  /**
   * Expõe a ação de deletar conta para os componentes da tela.
   */
  async function deletarConta(): Promise<void> {
    await deletarContaMutation.mutateAsync();
  }

  return {
    atualizarPerfil,
    alterarSenha,
    deletarConta,
    atualizandoPerfil: atualizarPerfilMutation.isPending,
    alterandoSenha: alterarSenhaMutation.isPending,
    deletandoConta: deletarContaMutation.isPending,
  };
}

/**
 * Converte erros conhecidos e desconhecidos em mensagens exibíveis ao usuário.
 */
function obterMensagemErro(erro: unknown): string {
  if (erro instanceof ErroApi) {
    return erro.message;
  }

  if (erro instanceof Error) {
    return erro.message;
  }

  return "Ocorreu um erro inesperado.";
}
