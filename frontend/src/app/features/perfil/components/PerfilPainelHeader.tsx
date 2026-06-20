import { ShieldCheck } from "lucide-react";

import {
  buscarSecaoPerfil,
  type SecaoPerfil,
} from "../data/perfil-secoes.constantes";

type PerfilPainelHeaderProps = {
  secaoAtiva: SecaoPerfil;
  contaAtiva: boolean;
};

export function PerfilPainelHeader({
  secaoAtiva,
  contaAtiva,
}: PerfilPainelHeaderProps) {
  const secao = buscarSecaoPerfil(secaoAtiva);

  return (
    <div className="mb-5 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-primary/10 p-6 shadow-xl shadow-black/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <ShieldCheck className="h-4 w-4" />
            Painel da conta
          </div>

          <h2 className="mt-2 text-2xl font-extrabold text-text-primary">
            {secao?.titulo}
          </h2>

          <p className="mt-1 text-text-secondary">{secao?.descricao}</p>
        </div>

        <div className="rounded-2xl border border-border bg-background/40 px-4 py-3">
          <p className="text-xs text-text-muted">Status</p>

          <p
            className={
              contaAtiva
                ? "font-semibold text-success"
                : "font-semibold text-danger"
            }
          >
            {contaAtiva ? "Conta ativa" : "Conta inativa"}
          </p>
        </div>
      </div>
    </div>
  );
}
