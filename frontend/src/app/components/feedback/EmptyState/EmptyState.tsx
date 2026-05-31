import { Button } from "@/app/components/ui/Button";
import { SearchX } from "lucide-react";
import { type ReactNode } from "react";

type EmptyStateProps = {
  titulo?: string;
  descricao?: string;
  acaoTexto?: string;
  onAcao?: () => void;
  icone?: ReactNode;
};

export function EmptyState({
  titulo = "Nenhum resultado encontrado",
  descricao = "Tente alterar os filtros ou fazer uma nova busca.",
  acaoTexto,
  onAcao,
  icone,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-text-muted">
        {icone ?? <SearchX className="h-7 w-7" />}
      </div>

      <h3 className="text-lg font-bold text-text-primary">{titulo}</h3>

      <p className="mt-2 max-w-md text-sm text-text-muted">{descricao}</p>

      {acaoTexto && onAcao && (
        <Button className="mt-6" variante="outline" onClick={onAcao}>
          {acaoTexto}
        </Button>
      )}
    </div>
  );
}
