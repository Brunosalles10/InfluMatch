import { Avatar } from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";
import { Card } from "@/app/components/ui/Card";
import type { RankingInfluenciador } from "@/app/types/ranking.types";
import {
  formatarNumeroCompacto,
  formatarPercentual,
} from "@/app/utils/formatadores";

type CriadorRankingCardProps = {
  criador: RankingInfluenciador;
  posicao: number;
};

export function CriadorRankingCard({
  criador,
  posicao,
}: CriadorRankingCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar nome={criador.nome} imagemUrl={criador.imagemUrl} />

          <div>
            <h3 className="font-bold text-text-primary">{criador.nome}</h3>

            <p className="text-sm text-text-muted">
              {criador.username
                ? `@${criador.username}`
                : "Username não informado"}
            </p>
          </div>
        </div>

        <Badge variante="primary">#{posicao}</Badge>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {criador.nicho ? (
          <Badge variante="secondary">{criador.nicho}</Badge>
        ) : (
          <Badge>Sem nicho</Badge>
        )}

        {criador.plataforma && <Badge>{criador.plataforma}</Badge>}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <MetricaCard
          label="Seguidores"
          valor={formatarNumeroCompacto(criador.seguidores)}
        />

        <MetricaCard
          label="Engajamento"
          valor={formatarPercentual(criador.taxaEngajamento)}
          destaque
        />

        <MetricaCard
          label="Visualizações"
          valor={formatarNumeroCompacto(criador.visualizacoes)}
        />

        <MetricaCard
          label="Crescimento"
          valor={
            criador.crescimentoPercentual !== undefined &&
            criador.crescimentoPercentual !== null
              ? formatarPercentual(criador.crescimentoPercentual)
              : "Não disponível"
          }
        />
      </div>
    </Card>
  );
}

type MetricaCardProps = {
  label: string;
  valor: string;
  destaque?: boolean;
};

function MetricaCard({ label, valor, destaque = false }: MetricaCardProps) {
  return (
    <div className="rounded-xl bg-surface-muted/60 p-3">
      <span className="text-xs text-text-muted">{label}</span>

      <p
        className={
          destaque
            ? "mt-1 font-bold text-success"
            : "mt-1 font-bold text-text-primary"
        }
      >
        {valor}
      </p>
    </div>
  );
}
