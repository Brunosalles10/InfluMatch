import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { ErrorState } from "@/app/components/feedback/ErrorState";
import { PageContainer } from "@/app/components/layout/PageContainer";
import { SectionHeader } from "@/app/components/layout/SectionHeader.tsx";
import { Spinner } from "@/app/components/ui/Spinner";
import { useAuth } from "@/app/hooks/useAuth";
import { mapearAlterarSenhaParaDto } from "@/app/mappers/auth.mapper";
import { mapearAtualizarPerfilParaDto } from "@/app/mappers/perfil.mapper";
import type { DadosAlterarSenha, DadosAtualizarPerfil } from "@/app/schemas";
import { ErroApi } from "@/app/services/api/ErroApi";
import { usuariosService } from "@/app/services/usuarios/usuariosService";
import { AlterarSenhaForm } from "../components/AlterarSenhaForm";
import { AtualizarPerfilForm } from "../components/AtualizarPerfilForm";
import { DeletarContaCard } from "../components/DeletarContaCard";
import { PerfilResumoCard } from "../components/PerfilResumoCard";

export function PerfilPage() {
  const { usuario, carregandoUsuario, recarregarPerfil, logout } = useAuth();

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

  async function atualizarPerfil(dados: DadosAtualizarPerfil) {
    await atualizarPerfilMutation.mutateAsync(dados);
  }

  async function alterarSenha(dados: DadosAlterarSenha) {
    await alterarSenhaMutation.mutateAsync(dados);
  }

  async function deletarConta() {
    await deletarContaMutation.mutateAsync();
  }

  if (carregandoUsuario) {
    return (
      <PageContainer>
        <div className="rounded-2xl border border-border bg-surface/70 p-10">
          <Spinner texto="Carregando perfil..." />
        </div>
      </PageContainer>
    );
  }

  if (!usuario) {
    return (
      <PageContainer>
        <ErrorState
          titulo="Perfil não encontrado"
          descricao="Não foi possível carregar os dados do usuário autenticado."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-8 pb-24">
      <SectionHeader
        titulo="Meu perfil"
        descricao="Gerencie seus dados de acesso, senha e configurações da conta."
      />

      <PerfilResumoCard usuario={usuario} />

      <div className="grid gap-8 xl:grid-cols-2">
        <AtualizarPerfilForm
          usuario={usuario}
          carregando={atualizarPerfilMutation.isPending}
          aoAtualizar={atualizarPerfil}
        />

        <AlterarSenhaForm
          carregando={alterarSenhaMutation.isPending}
          aoAlterarSenha={alterarSenha}
        />
      </div>

      <DeletarContaCard
        carregando={deletarContaMutation.isPending}
        aoDeletarConta={deletarConta}
      />
    </PageContainer>
  );
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
