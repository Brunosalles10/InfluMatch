import { Badge } from "@/app/components/ui/Badge";
import { HomeSearchForm } from "./HomeSearchForm";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 text-center sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative">
        <Badge variante="success">+2.5M criadores analisados</Badge>

        <h1 className="mx-auto mt-6 max-w-5xl text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl lg:text-7xl">
          Encontre Criadores de{" "}
          <span className="bg-gradient-to-r from-primary via-secondary-hover to-secondary bg-clip-text text-transparent">
            Alto Engajamento
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-text-secondary">
          Descubra influenciadores, conteúdos virais e oportunidades por nicho
          com dados organizados para apoiar campanhas e decisões estratégicas.
        </p>

        <HomeSearchForm />
      </div>
    </section>
  );
}
