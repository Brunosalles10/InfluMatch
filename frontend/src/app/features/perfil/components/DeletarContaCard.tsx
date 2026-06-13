import { AlertTriangle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";

type DeletarContaCardProps = {
  carregando: boolean;
  aoDeletarConta: () => Promise<void>;
};

const TEXTO_CONFIRMACAO = "EXCLUIR";

export function DeletarContaCard({
  carregando,
  aoDeletarConta,
}: DeletarContaCardProps) {
  const [confirmacao, setConfirmacao] = useState("");

  const podeDeletar = confirmacao === TEXTO_CONFIRMACAO;

  return (
    <Card className="border-danger/40 bg-danger/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-danger">
          <AlertTriangle className="h-5 w-5" />
          Deletar conta
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <p className="leading-7 text-text-secondary">
          Esta ação desativa sua conta no sistema. Depois disso, você não
          conseguirá mais acessar a plataforma com este usuário.
        </p>

        <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm text-text-secondary">
          Para confirmar, digite{" "}
          <strong className="text-danger">{TEXTO_CONFIRMACAO}</strong> no campo
          abaixo.
        </div>

        <Input
          label="Confirmação"
          placeholder={TEXTO_CONFIRMACAO}
          value={confirmacao}
          onChange={(event) => setConfirmacao(event.target.value)}
        />

        <Button
          type="button"
          variante="danger"
          disabled={!podeDeletar || carregando}
          carregando={carregando}
          onClick={aoDeletarConta}
        >
          Deletar minha conta
        </Button>
      </CardContent>
    </Card>
  );
}
