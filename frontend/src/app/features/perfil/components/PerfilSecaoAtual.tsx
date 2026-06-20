import type { DadosAlterarSenha, DadosAtualizarPerfil } from "@/app/schemas";
import type { Usuario } from "@/app/types/usuario.types";
import type { SecaoPerfil } from "../data/perfil-secoes.constantes";
import { AlterarSenhaForm } from "./AlterarSenhaForm";
import { AtualizarPerfilForm } from "./AtualizarPerfilForm";
import { DeletarContaCard } from "./DeletarContaCard";

type PerfilSecaoAtualProps = {
  secaoAtiva: SecaoPerfil;
  usuario: Usuario;
  atualizandoPerfil: boolean;
  alterandoSenha: boolean;
  deletandoConta: boolean;
  aoAtualizarPerfil: (dados: DadosAtualizarPerfil) => Promise<void>;
  aoAlterarSenha: (dados: DadosAlterarSenha) => Promise<void>;
  aoDeletarConta: () => Promise<void>;
};

export function PerfilSecaoAtual({
  secaoAtiva,
  usuario,
  atualizandoPerfil,
  alterandoSenha,
  deletandoConta,
  aoAtualizarPerfil,
  aoAlterarSenha,
  aoDeletarConta,
}: PerfilSecaoAtualProps) {
  if (secaoAtiva === "dados") {
    return (
      <AtualizarPerfilForm
        usuario={usuario}
        carregando={atualizandoPerfil}
        aoAtualizar={aoAtualizarPerfil}
      />
    );
  }

  if (secaoAtiva === "senha") {
    return (
      <AlterarSenhaForm
        carregando={alterandoSenha}
        aoAlterarSenha={aoAlterarSenha}
      />
    );
  }

  return (
    <DeletarContaCard
      carregando={deletandoConta}
      aoDeletarConta={aoDeletarConta}
    />
  );
}
