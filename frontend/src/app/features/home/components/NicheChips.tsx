import { OPCOES_NICHOS_HOME } from "@/app/features/home/data/home.constantes";
import { combinarClasses } from "@/app/utils/cn";

type NicheChipsProps = {
  nichoSelecionado?: string;
  aoSelecionarNicho: (nicho: string) => void;
};

export function NicheChips({
  nichoSelecionado,
  aoSelecionarNicho,
}: NicheChipsProps) {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      {OPCOES_NICHOS_HOME.map((nicho) => {
        const selecionado = nichoSelecionado === nicho.value;

        return (
          <button
            key={nicho.value}
            type="button"
            onClick={() => aoSelecionarNicho(nicho.value)}
            className={combinarClasses(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
              selecionado
                ? "border-primary bg-primary/15 text-primary shadow-[0_0_24px_rgba(14,165,233,0.18)]"
                : "border-border bg-surface/70 text-text-secondary hover:border-primary hover:text-primary",
            )}
          >
            {nicho.label}
          </button>
        );
      })}
    </div>
  );
}
