import { Badge } from "@/app/components/ui/Badge";
import { Card } from "@/app/components/ui/Card";
import type { RankingConteudo } from "@/app/types/ranking.types";
import {
  formatarNumeroCompacto,
  formatarPercentual,
  limitarTexto,
} from "@/app/utils/formatadores";
import { ExternalLink, Eye, MessageCircle, Play, ThumbsUp } from "lucide-react";

type ViralContentPreviewCardProps = {
  conteudo: RankingConteudo;
  posicao: number;
};

export function ViralContentPreviewCard({
  conteudo,
  posicao,
}: ViralContentPreviewCardProps) {
  return (
    <Card className="overflow-hidden transition-transform hover:-translate-y-1">
      <div className="relative aspect-video bg-surface-muted">
        {conteudo.thumbnailUrl ? (
          <img
            src={conteudo.thumbnailUrl}
            alt={conteudo.titulo}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-muted to-surface">
            <Play className="h-10 w-10 text-primary" />
          </div>
        )}

        <Badge variante="danger" className="absolute left-3 top-3">
          #{posicao} Viral
        </Badge>
      </div>

      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge variante="primary">{conteudo.plataforma}</Badge>
          <Badge variante="secondary">{conteudo.tipoConteudo}</Badge>
          {conteudo.nicho && <Badge>{conteudo.nicho}</Badge>}
        </div>

        <h3 className="min-h-12 font-bold leading-6 text-text-primary">
          {limitarTexto(conteudo.titulo, 70)}
        </h3>

        <p className="mt-2 text-sm text-text-muted">
          {conteudo.nomeCriador ?? "Criador não informado"}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-xl bg-surface-muted/60 p-3">
            <Eye className="mb-1 h-4 w-4 text-primary" />
            <p className="font-bold text-text-primary">
              {formatarNumeroCompacto(conteudo.visualizacoes)}
            </p>
          </div>

          <div className="rounded-xl bg-surface-muted/60 p-3">
            <ThumbsUp className="mb-1 h-4 w-4 text-success" />
            <p className="font-bold text-text-primary">
              {formatarNumeroCompacto(conteudo.curtidas)}
            </p>
          </div>

          <div className="rounded-xl bg-surface-muted/60 p-3">
            <MessageCircle className="mb-1 h-4 w-4 text-secondary-hover" />
            <p className="font-bold text-text-primary">
              {formatarNumeroCompacto(conteudo.comentarios)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-success">
            {formatarPercentual(conteudo.taxaEngajamento)}
          </span>

          {conteudo.urlOriginal && (
            <a
              href={conteudo.urlOriginal}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Abrir
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
