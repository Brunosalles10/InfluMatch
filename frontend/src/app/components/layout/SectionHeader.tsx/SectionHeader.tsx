import { type ReactNode } from "react";

type SectionHeaderProps = {
  titulo: string;
  descricao?: string;
  icone?: ReactNode;
  acao?: ReactNode;
};

export function SectionHeader({
  titulo,
  descricao,
  icone,
  acao,
}: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          {icone && <span className="text-2xl">{icone}</span>}
          <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {titulo}
          </h2>
        </div>

        {descricao && <p className="mt-2 text-text-secondary">{descricao}</p>}
      </div>

      {acao && <div>{acao}</div>}
    </div>
  );
}
