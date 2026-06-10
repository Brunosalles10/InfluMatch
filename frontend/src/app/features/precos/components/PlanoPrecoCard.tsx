import { Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { combinarClasses } from "@/app/utils/cn";
import type { PlanoPreco } from "../data/precos.constantes";
import { ConstrutorAcoesPrecos } from "../utils/ConstrutorAcoesPrecos";

type PlanoPrecoCardProps = {
  plano: PlanoPreco;
};

export function PlanoPrecoCard({ plano }: PlanoPrecoCardProps) {
  const navigate = useNavigate();

  function selecionarPlano() {
    const rota = ConstrutorAcoesPrecos.obterRota(plano);

    if (rota) {
      navigate(rota);
      return;
    }

    toast.info(ConstrutorAcoesPrecos.obterMensagemPlaceholder(plano));
  }

  return (
    <Card
      className={combinarClasses(
        "relative flex h-full flex-col p-6 transition-transform hover:-translate-y-1",
        plano.destaque && "border-primary shadow-glow",
      )}
    >
      {plano.selo && (
        <div className="absolute right-5 top-5">
          <Badge variante="primary">{plano.selo}</Badge>
        </div>
      )}

      <div className="mb-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>

        <h3 className="text-2xl font-extrabold text-text-primary">
          {plano.nome}
        </h3>

        <p className="mt-3 min-h-12 text-sm leading-6 text-text-muted">
          {plano.descricao}
        </p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-extrabold text-text-primary">
          {plano.preco}
        </span>

        {plano.periodo && (
          <span className="ml-1 text-sm text-text-muted">{plano.periodo}</span>
        )}
      </div>

      <Button
        type="button"
        variante={plano.destaque ? "primary" : "outline"}
        larguraTotal
        onClick={selecionarPlano}
      >
        {plano.textoBotao}
      </Button>

      <div className="mt-8 flex-1 space-y-4">
        {plano.recursos.map((recurso) => (
          <div key={recurso} className="flex gap-3">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />

            <span className="text-sm leading-6 text-text-secondary">
              {recurso}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
