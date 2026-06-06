import { PageContainer } from "@/app/components/layout/PageContainer";
import { Button } from "@/app/components/ui/Button";
import { Link } from "react-router";

export function HomePage() {
  return (
    <PageContainer>
      <section className="py-20 text-center">
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold text-text-primary sm:text-6xl">
          Encontre Criadores de{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Alto Engajamento
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
          Plataforma para descobrir influenciadores, conteúdos virais e nichos
          com dados reais.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Button asChild={false}>
            <Link to="/cadastro">Começar grátis</Link>
          </Button>

          <Button variante="outline">
            <Link to="/login">Entrar</Link>
          </Button>
        </div>
      </section>
    </PageContainer>
  );
}
