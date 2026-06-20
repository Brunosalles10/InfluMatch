import { ShieldCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";

export function ContatoComercialOrientacoesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Validação segura
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm leading-6 text-text-secondary">
        <p>Formulário de contato comercial</p>

        <ul className="list-inside list-disc space-y-2">
          <li>Solicite dados personalizados sobre qualquer assunto.</li>
          <li>
            Reclamações ou sugestões podem ser enviadas através do formulário.
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
