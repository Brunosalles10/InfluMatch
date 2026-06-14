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

export function usePerfilMutations({
  usuario,
  recarregarPerfil,
  logout,
}: UsePerfilMutationsParams) {
  const atualizarPerfilMutation = useMutation({
    mutationFn: async (dados: DadosAtualizarPerfil) => {
      if (!usuario?.id) {
        throw new Error("Usuário autenticado não encontrado.");
      }

      return usuariosService.atualizarMinhaConta(
        usuario.id,
        mapearAtualizarPerfilParaDto(dados),
      );
    },
    onSuccess: async () => {
      await recarregarPerfil();
      toast.success("Perfil atualizado com sucesso.");
    },
    onError: (erro) => {
      toast.error(obterMensagemErro(erro));
    },
  });

  const alterarSenhaMutation = useMutation({
    mutationFn: (dados: DadosAlterarSenha) => {
      return usuariosService.alterarMinhaSenha(
        mapearAlterarSenhaParaDto(dados),
      );
    },
    onSuccess: () => {
      toast.success("Senha alterada com sucesso.");
    },
    onError: (erro) => {
      toast.error(obterMensagemErro(erro));
    },
  });

  const deletarContaMutation = useMutation({
    mutationFn: () => usuariosService.deletarMinhaConta(),
    onSuccess: () => {
      toast.success("Conta deletada com sucesso.");
      logout();
    },
    onError: (erro) => {
      toast.error(obterMensagemErro(erro));
    },
  });

  async function atualizarPerfil(dados: DadosAtualizarPerfil): Promise<void> {
    await atualizarPerfilMutation.mutateAsync(dados);
  }

  async function alterarSenha(dados: DadosAlterarSenha): Promise<void> {
    await alterarSenhaMutation.mutateAsync(dados);
  }

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

function obterMensagemErro(erro: unknown) {
  if (erro instanceof ErroApi) {
    return erro.message;
  }

  if (erro instanceof Error) {
    return erro.message;
  }

  return "Ocorreu um erro inesperado.";
}
