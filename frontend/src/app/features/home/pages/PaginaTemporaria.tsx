import { PageContainer } from "@/app/components/layout/PageContainer";
import { Card } from "@/app/components/ui/Card";
import { useSearchParams } from "react-router";

type PaginaTemporariaProps = {
  titulo: string;
  descricao: string;
};

export function PaginaTemporaria({ titulo, descricao }: PaginaTemporariaProps) {
  const [searchParams] = useSearchParams();

  return (
    <PageContainer>
      <Card className="p-8">
        <h1 className="text-3xl font-extrabold text-text-primary">{titulo}</h1>

        <p className="mt-3 text-text-secondary">{descricao}</p>

        <div className="mt-6 rounded-xl border border-border bg-surface-muted/40 p-4">
          <span className="text-sm font-semibold text-text-muted">
            Query params recebidos:
          </span>

          <pre className="mt-3 overflow-x-auto text-sm text-text-secondary">
            {JSON.stringify(
              Object.fromEntries(searchParams.entries()),
              null,
              2,
            )}
          </pre>
        </div>
      </Card>
    </PageContainer>
  );
}
