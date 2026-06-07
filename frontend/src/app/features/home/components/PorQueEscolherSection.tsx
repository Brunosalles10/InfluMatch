import { SectionHeader } from "@/app/components/layout/SectionHeader.tsx";
import { Card } from "@/app/components/ui/Card";
import { BENEFICIOS_HOME } from "@/app/features/home/data/home.constantes";

export function PorQueEscolherSection() {
  return (
    <section>
      <SectionHeader
        titulo="Por que escolher o InfluMatch?"
        descricao="Uma plataforma pensada para organizar dados de influência digital de forma simples, escalável e adequada para análise."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {BENEFICIOS_HOME.map((beneficio) => {
          const Icone = beneficio.Icone;

          return (
            <Card
              key={beneficio.titulo}
              className="p-6 transition-transform hover:-translate-y-1"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Icone className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-bold text-text-primary">
                {beneficio.titulo}
              </h3>

              <p className="mt-3 text-sm leading-6 text-text-muted">
                {beneficio.descricao}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
