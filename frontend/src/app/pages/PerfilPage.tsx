import { PageContainer } from "@/app/components/layout/PageContainer";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { useAuth } from "@/app/hooks/useAuth";
import { LogOut, Shield, User } from "lucide-react";

export function PerfilPage() {
  const { usuario, logout } = useAuth();

  return (
    <PageContainer>
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Meu Perfil
                </CardTitle>

                <p className="mt-2 text-sm text-text-muted">
                  Informações da sua conta no InfluMatch.
                </p>
              </div>

              <Button
                variante="outline"
                iconeEsquerda={<LogOut className="h-4 w-4" />}
                onClick={logout}
              >
                Sair
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="rounded-xl border border-border bg-surface-muted/40 p-4">
              <span className="text-sm text-text-muted">Nome</span>
              <p className="mt-1 font-semibold text-text-primary">
                {usuario?.nome}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface-muted/40 p-4">
              <span className="text-sm text-text-muted">Email</span>
              <p className="mt-1 font-semibold text-text-primary">
                {usuario?.email}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface-muted/40 p-4">
              <span className="text-sm text-text-muted">Permissão</span>

              <div className="mt-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <Badge
                  variante={usuario?.role === "ADMIN" ? "secondary" : "primary"}
                >
                  {usuario?.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
