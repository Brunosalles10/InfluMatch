import { Mail, ShieldCheck, UserRound } from "lucide-react";

import { Badge } from "@/app/components/ui/Badge";
import { Card, CardContent } from "@/app/components/ui/Card";
import type { Usuario } from "@/app/types/usuario.types";

type PerfilResumoCardProps = {
  usuario: Usuario;
};

export function PerfilResumoCard({ usuario }: PerfilResumoCardProps) {
  const iniciais = obterIniciais(usuario.nome);

  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-primary/40 via-secondary/30 to-primary/10" />

      <CardContent className="-mt-12 space-y-6 p-6">
        <div className="flex items-end justify-between gap-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-primary/30 bg-background text-3xl font-extrabold text-primary shadow-xl shadow-black/20">
            {iniciais}
          </div>

          <Badge variante={usuario.role === "ADMIN" ? "primary" : "secondary"}>
            {usuario.role}
          </Badge>
        </div>

        <div>
          <h2 className="break-words text-2xl font-extrabold text-text-primary">
            {usuario.nome}
          </h2>

          <div className="mt-2 flex items-center gap-2 text-sm text-text-muted">
            <Mail className="h-4 w-4 shrink-0" />
            <span className="break-all">{usuario.email}</span>
          </div>
        </div>

        <div className="grid gap-3">
          <InfoPerfil
            Icone={ShieldCheck}
            label="Status da conta"
            valor={usuario.ativo ? "Ativa" : "Inativa"}
            destaque={usuario.ativo}
          />

          <InfoPerfil
            Icone={UserRound}
            label="ID do usuário"
            valor={usuario.id}
          />
        </div>
      </CardContent>
    </Card>
  );
}

type InfoPerfilProps = {
  label: string;
  valor: string;
  Icone: typeof UserRound;
  destaque?: boolean;
};

function InfoPerfil({ label, valor, Icone, destaque }: InfoPerfilProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-muted/40 p-4">
      <span
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
          destaque
            ? "border-success/30 bg-success/10 text-success"
            : "border-border bg-surface text-text-muted",
        ].join(" ")}
      >
        <Icone className="h-5 w-5" />
      </span>

      <div className="min-w-0">
        <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
          {label}
        </span>

        <p className="mt-1 break-all font-semibold text-text-primary">
          {valor}
        </p>
      </div>
    </div>
  );
}

function obterIniciais(nome: string) {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");
}
