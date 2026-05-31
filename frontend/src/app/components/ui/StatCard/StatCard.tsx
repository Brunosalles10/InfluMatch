import { Card } from "@/app/components/ui/Card";
import { combinarClasses } from "@/app/utils/cn";
import { type ReactNode } from "react";

type StatCardProps = {
  titulo: string;
  valor: string;
  descricao?: string;
  icone?: ReactNode;
  className?: string;
};

export function StatCard({
  titulo,
  valor,
  descricao,
  icone,
  className,
}: StatCardProps) {
  return (
    <Card className={combinarClasses("p-6 text-center", className)}>
      {icone && (
        <div className="mb-3 flex justify-center text-primary">{icone}</div>
      )}

      <strong className="block text-3xl font-extrabold text-primary">
        {valor}
      </strong>

      <span className="mt-1 block text-sm font-medium text-text-primary">
        {titulo}
      </span>

      {descricao && <p className="mt-2 text-sm text-text-muted">{descricao}</p>}
    </Card>
  );
}
