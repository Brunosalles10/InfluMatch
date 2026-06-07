import { StatCard } from "@/app/components/ui/StatCard";
import { ESTATISTICAS_HOME } from "@/app/features/home/data/home.constantes";

export function StatsSection() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ESTATISTICAS_HOME.map((estatistica) => {
        const Icone = estatistica.Icone;

        return (
          <StatCard
            key={estatistica.titulo}
            titulo={estatistica.titulo}
            valor={estatistica.valor}
            descricao={estatistica.descricao}
            icone={<Icone className="h-7 w-7" />}
          />
        );
      })}
    </section>
  );
}
