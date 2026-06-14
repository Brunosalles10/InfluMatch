import { useState } from "react";

import { ErrorState } from "@/app/components/feedback/ErrorState";
import { PageContainer } from "@/app/components/layout/PageContainer";
import { SectionHeader } from "@/app/components/layout/SectionHeader.tsx";
import { Spinner } from "@/app/components/ui/Spinner";
import { useAuth } from "@/app/hooks/useAuth";
import { usePerfilMutations } from "@/app/hooks/usePerfilMutations";
import { PerfilMenu } from "../components/PerfilMenu";
import { PerfilPainelHeader } from "../components/PerfilPainelHeader";
import { PerfilResumoCard } from "../components/PerfilResumoCard";
import { PerfilSecaoAtual } from "../components/PerfilSecaoAtual";
import type { SecaoPerfil } from "../data/perfil-secoes.constantes";

export function PerfilPage() {
  const { usuario, carregandoUsuario, recarregarPerfil, logout } = useAuth();
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoPerfil>("dados");

  const {
    atualizarPerfil,
    alterarSenha,
    deletarConta,
    atualizandoPerfil,
    alterandoSenha,
    deletandoConta,
  } = usePerfilMutations({
    usuario,
    recarregarPerfil,
    logout,
  });

  if (carregandoUsuario) {
    return (
      <PageContainer>
        <div className="rounded-3xl border border-border bg-surface/70 p-10">
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
        descricao="Centralize os dados da sua conta, segurança e preferências de acesso."
      />

      <div className="grid gap-8 xl:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <PerfilResumoCard usuario={usuario} />

          <PerfilMenu
            secaoAtiva={secaoAtiva}
            role={usuario.role}
            aoSelecionarSecao={setSecaoAtiva}
          />
        </aside>

        <section className="min-w-0">
          <PerfilPainelHeader
            secaoAtiva={secaoAtiva}
            contaAtiva={usuario.ativo ?? false}
          />

          <PerfilSecaoAtual
            secaoAtiva={secaoAtiva}
            usuario={usuario}
            atualizandoPerfil={atualizandoPerfil}
            alterandoSenha={alterandoSenha}
            deletandoConta={deletandoConta}
            aoAtualizarPerfil={atualizarPerfil}
            aoAlterarSenha={alterarSenha}
            aoDeletarConta={deletarConta}
          />
        </section>
      </div>
    </PageContainer>
  );
}
