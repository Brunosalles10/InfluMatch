import { Button } from "@/app/components/ui/Button";

type RankingPaginationProps = {
  paginaAtual: number;
  totalPaginas: number;
  aoAlterarPagina: (pagina: number) => void;
};

export function RankingPagination({
  paginaAtual,
  totalPaginas,
  aoAlterarPagina,
}: RankingPaginationProps) {
  const paginaAnteriorDesabilitada = paginaAtual <= 1;
  const proximaPaginaDesabilitada = paginaAtual >= totalPaginas;

  if (totalPaginas <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-surface/70 p-4 sm:flex-row">
      <p className="text-sm text-text-muted">
        Página{" "}
        <span className="font-semibold text-text-primary">{paginaAtual}</span>{" "}
        de{" "}
        <span className="font-semibold text-text-primary">{totalPaginas}</span>
      </p>

      <div className="flex gap-3">
        <Button
          type="button"
          variante="outline"
          disabled={paginaAnteriorDesabilitada}
          onClick={() => aoAlterarPagina(paginaAtual - 1)}
        >
          Anterior
        </Button>

        <Button
          type="button"
          disabled={proximaPaginaDesabilitada}
          onClick={() => aoAlterarPagina(paginaAtual + 1)}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
