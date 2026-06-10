import { Avatar } from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";
import { Card } from "@/app/components/ui/Card";
import type { RankingInfluenciador } from "@/app/types/ranking.types";
import {
  formatarNumeroCompacto,
  formatarPercentual,
} from "@/app/utils/formatadores";

type CreatorPreviewCardProps = {
  criador: RankingInfluenciador;
  posicao: number;
};

export function CreatorPreviewCard({
  criador,
  posicao,
}: CreatorPreviewCardProps) {
  return (
    <Card className="p-5 transition-transform hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar nome={criador.nome} imagemUrl={criador.imagemUrl} />

          <div>
            <h3 className="font-bold text-text-primary">{criador.nome}</h3>

            <p className="text-sm text-text-muted">
              {criador.username
                ? `@${criador.username}`
                : "Username indisponível"}
            </p>
          </div>
        </div>

        <Badge variante="primary">#{posicao}</Badge>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {criador.nicho && <Badge variante="secondary">{criador.nicho}</Badge>}
        {criador.plataforma && <Badge>{criador.plataforma}</Badge>}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface-muted/60 p-3">
          <span className="text-xs text-text-muted">Seguidores</span>
          <p className="mt-1 font-bold text-text-primary">
            {formatarNumeroCompacto(criador.seguidores)}
          </p>
        </div>

        <div className="rounded-xl bg-surface-muted/60 p-3">
          <span className="text-xs text-text-muted">Engajamento</span>
          <p className="mt-1 font-bold text-success">
            {formatarPercentual(criador.taxaEngajamento)}
          </p>
        </div>
      </div>
    </Card>
  );
}
