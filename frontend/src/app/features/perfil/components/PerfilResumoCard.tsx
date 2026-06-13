import { Badge } from "@/app/components/ui/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import type { Usuario } from "@/app/types/usuario.types";

type PerfilResumoCardProps = {
  usuario: Usuario;
};

export function PerfilResumoCard({ usuario }: PerfilResumoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Minha conta</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-text-primary">
              {usuario.nome}
            </h2>

            <p className="mt-1 text-text-muted">{usuario.email}</p>
          </div>

          <Badge variante={usuario.role === "ADMIN" ? "primary" : "secondary"}>
            {usuario.role}
          </Badge>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <InfoPerfil label="ID do usuário" valor={usuario.id} />

          <InfoPerfil
            label="Status"
            valor={usuario.ativo ? "Ativo" : "Inativo"}
          />
        </div>
      </CardContent>
    </Card>
  );
}

type InfoPerfilProps = {
  label: string;
  valor: string;
};

function InfoPerfil({ label, valor }: InfoPerfilProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface-muted/50 p-4">
      <span className="text-sm text-text-muted">{label}</span>

      <p className="mt-1 break-all font-semibold text-text-primary">{valor}</p>
    </div>
  );
}
