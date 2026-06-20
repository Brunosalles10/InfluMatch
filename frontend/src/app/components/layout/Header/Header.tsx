import { Button } from "@/app/components/ui/Button";
import { useAuth } from "@/app/hooks/useAuth";
import { combinarClasses } from "@/app/utils/cn";
import { BarChart3, LogOut, Sparkles } from "lucide-react";
import { Link, NavLink } from "react-router";

const itensNavegacao = [
  { label: "Início", to: "/" },
  { label: "Criadores", to: "/criadores" },
  { label: "Vídeos Virais", to: "/videos-virais" },
  { label: "Preços", to: "/precos" },
  { label: "Contato", to: "/contato-comercial" },
];

export function Header() {
  const { autenticado, usuario, usuarioAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-glow">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>

          <div>
            <strong className="block text-lg font-extrabold text-text-primary">
              InfluMatch
            </strong>
            <span className="hidden text-xs text-text-muted sm:block">
              Creator Analytics
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {itensNavegacao.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                combinarClasses(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-text-secondary",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {autenticado ? (
            <>
              {usuarioAdmin && (
                <Link
                  to="/admin/coleta-youtube"
                  className="hidden rounded-xl border border-secondary/40 px-4 py-2 text-sm font-semibold text-secondary-hover transition-colors hover:bg-secondary/10 sm:inline-flex"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/perfil"
                className="hidden rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:border-primary hover:text-primary sm:inline-flex"
              >
                {usuario?.nome ?? "Perfil"}
              </Link>

              <Button
                variante="ghost"
                tamanho="sm"
                iconeEsquerda={<LogOut className="h-4 w-4" />}
                onClick={logout}
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden text-sm font-semibold text-text-secondary transition-colors hover:text-primary sm:inline-flex"
              >
                Entrar
              </Link>

              <Link
                to="/cadastro"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(14,165,233,0.25)] transition-colors hover:bg-primary-hover"
              >
                <Sparkles className="h-4 w-4" />
                Começar Grátis
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
