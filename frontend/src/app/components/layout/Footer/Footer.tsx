import { BarChart3 } from "lucide-react";
import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-secondary/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>

            <strong className="text-lg font-extrabold text-text-primary">
              InfluMatch
            </strong>
          </Link>

          <p className="mt-4 max-w-md text-sm leading-6 text-text-muted">
            Plataforma para encontrar criadores de conteúdo, analisar conteúdos
            virais e segmentar influenciadores por nicho, plataforma e
            engajamento.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
            Navegação
          </h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-text-muted">
            <Link to="/criadores" className="hover:text-primary">
              Criadores
            </Link>
            <Link to="/videos-virais" className="hover:text-primary">
              Vídeos Virais
            </Link>
            <Link to="/precos" className="hover:text-primary">
              Preços
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
            Projeto
          </h3>

          <p className="mt-4 text-sm leading-6 text-text-muted">
            Desenvolvido como sistema de TCC usando React, TypeScript, NestJS,
            Prisma, MySQL, Redis e Docker.
          </p>
        </div>
      </div>

      <div className="border-t border-border px-4 py-5 text-center text-sm text-text-muted">
        © {new Date().getFullYear()} InfluMatch. Todos os direitos reservados.
      </div>
    </footer>
  );
}
