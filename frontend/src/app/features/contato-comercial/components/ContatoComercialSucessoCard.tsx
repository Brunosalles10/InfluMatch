import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/app/components/ui/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import type { ContatoComercialValidado } from "@/app/types/contato-comercial.types";
import { formatarDataHoraBrasileira } from "@/app/utils/documentosBrasileiros";

type ContatoComercialSucessoCardProps = {
  contatoValidado: ContatoComercialValidado;
};

export function ContatoComercialSucessoCard({
  contatoValidado,
}: ContatoComercialSucessoCardProps) {
  return (
    <Card className="border-success/30 bg-success/5">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Mensagem enviada com sucesso!
          </CardTitle>

          <Badge variante="success">Sucesso</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 text-sm text-text-secondary">
        <p>{contatoValidado.mensagem}</p>

        <div className="grid gap-4 md:grid-cols-2">
          <Info titulo="Protocolo" valor={contatoValidado.protocolo} />

          <Info
            titulo="Validado em"
            valor={formatarDataHoraBrasileira(contatoValidado.validadoEm)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

type InfoProps = {
  titulo: string;
  valor: string;
};

function Info({ titulo, valor }: InfoProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface/80 p-4">
      <span className="text-xs text-text-muted">{titulo}</span>
      <p className="mt-1 font-semibold text-text-primary">{valor}</p>
    </div>
  );
}
