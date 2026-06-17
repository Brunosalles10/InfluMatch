import { Badge } from "@/app/components/ui/Badge";

export function PrecosHeroSection() {
  return (
    <section className="relative overflow-hidden py-16 text-center sm:py-20">
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative">
        <Badge variante="secondary">Planos futuros</Badge>

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl">
          Planos para evoluir sua análise de{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            influência digital
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-text-secondary">
          Essa estrutura foi planejada para representar uma evolução futura com
          assinaturas, recursos avançados e planos corporativos.
        </p>
      </div>
    </section>
  );
}
