import { Button } from "@/app/components/ui/Button";
import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  titulo?: string;
  descricao?: string;
  tentarNovamente?: () => void;
};

export function ErrorState({
  titulo = "Ocorreu um erro",
  descricao = "Não foi possível carregar as informações. Tente novamente em instantes.",
  tentarNovamente,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-danger/30 bg-danger/10 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger/15 text-danger">
        <AlertTriangle className="h-7 w-7" />
      </div>

      <h3 className="text-lg font-bold text-text-primary">{titulo}</h3>

      <p className="mt-2 max-w-md text-sm text-text-secondary">{descricao}</p>

      {tentarNovamente && (
        <Button className="mt-6" variante="danger" onClick={tentarNovamente}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
