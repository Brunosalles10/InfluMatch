import { ChevronRight } from "lucide-react";

import { Badge } from "@/app/components/ui/Badge";
import { Card, CardContent } from "@/app/components/ui/Card";
import {
  SECOES_PERFIL,
  type SecaoPerfil,
} from "../data/perfil-secoes.constantes";

type PerfilMenuProps = {
  secaoAtiva: SecaoPerfil;
  role: string;
  aoSelecionarSecao: (secao: SecaoPerfil) => void;
};

export function PerfilMenu({
  secaoAtiva,
  role,
  aoSelecionarSecao,
}: PerfilMenuProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        <div className="mb-3 flex items-center justify-between px-3 pt-2">
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Configurações
            </p>

            <p className="text-xs text-text-muted">
              Escolha o que deseja gerenciar
            </p>
          </div>

          <Badge variante={role === "ADMIN" ? "primary" : "secondary"}>
            {role}
          </Badge>
        </div>

        <div className="space-y-2">
          {SECOES_PERFIL.map((secao) => {
            const ativo = secaoAtiva === secao.id;
            const Icone = secao.Icone;

            return (
              <button
                key={secao.id}
                type="button"
                onClick={() => aoSelecionarSecao(secao.id)}
                className={[
                  "group flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition",
                  ativo
                    ? "border-primary/50 bg-primary/10 text-text-primary shadow-lg shadow-primary/10"
                    : "border-transparent bg-transparent text-text-secondary hover:border-border hover:bg-surface-muted/50 hover:text-text-primary",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition",
                    ativo
                      ? "border-primary/40 bg-primary/20 text-primary"
                      : "border-border bg-surface text-text-muted group-hover:text-primary",
                  ].join(" ")}
                >
                  <Icone className="h-5 w-5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{secao.titulo}</span>

                  <span className="mt-1 block text-sm text-text-muted">
                    {secao.descricao}
                  </span>
                </span>

                <ChevronRight
                  className={[
                    "h-5 w-5 shrink-0 transition",
                    ativo
                      ? "translate-x-0 text-primary"
                      : "text-text-muted group-hover:translate-x-1 group-hover:text-primary",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
