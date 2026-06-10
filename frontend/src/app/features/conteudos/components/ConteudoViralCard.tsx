import {
  CalendarDays,
  ExternalLink,
  Eye,
  MessageCircle,
  Play,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/app/components/ui/Badge";
import { Card } from "@/app/components/ui/Card";
import type { RankingConteudo } from "@/app/types/ranking.types";
import {
  formatarNumeroCompacto,
  formatarPercentual,
  limitarTexto,
} from "@/app/utils/formatadores";
import { formatarDataPublicacao } from "../utils/conteudos.helpers";

type ConteudoViralCardProps = {
  conteudo: RankingConteudo;
  posicao: number;
};

export function ConteudoViralCard({
  conteudo,
  posicao,
}: ConteudoViralCardProps) {
  return (
    <Card className="overflow-hidden transition-transform hover:-translate-y-1">
      <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
        <ThumbnailConteudo conteudo={conteudo} posicao={posicao} />

        <div className="flex flex-col justify-between p-5">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variante="primary">{conteudo.plataforma}</Badge>
              <Badge variante="secondary">{conteudo.tipoConteudo}</Badge>

              {conteudo.nicho ? (
                <Badge>{conteudo.nicho}</Badge>
              ) : (
                <Badge>Sem nicho</Badge>
              )}
            </div>

            <h3 className="text-lg font-bold leading-7 text-text-primary">
              {limitarTexto(conteudo.titulo, 120)}
            </h3>

            <p className="mt-2 text-sm text-text-muted">
              {conteudo.nomeCriador ?? "Criador não informado"}
              {conteudo.usernameCriador
                ? ` • @${conteudo.usernameCriador}`
                : ""}
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MetricaConteudo
              label="Views"
              valor={formatarNumeroCompacto(conteudo.visualizacoes)}
              icone={<Eye className="h-4 w-4" />}
            />

            <MetricaConteudo
              label="Likes"
              valor={formatarNumeroCompacto(conteudo.curtidas)}
              icone={<ThumbsUp className="h-4 w-4" />}
            />

            <MetricaConteudo
              label="Comentários"
              valor={formatarNumeroCompacto(conteudo.comentarios)}
              icone={<MessageCircle className="h-4 w-4" />}
            />

            <MetricaConteudo
              label="Engajamento"
              valor={formatarPercentual(conteudo.taxaEngajamento)}
              icone={<TrendingUp className="h-4 w-4" />}
              destaque
            />

            <MetricaConteudo
              label="Publicado"
              valor={formatarDataPublicacao(conteudo.publicadoEm)}
              icone={<CalendarDays className="h-4 w-4" />}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-text-muted">
              Posição no ranking:{" "}
              <strong className="text-primary">#{posicao}</strong>
            </span>

            {conteudo.urlOriginal ? (
              <a
                href={conteudo.urlOriginal}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                Abrir conteúdo original
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <span className="text-sm text-text-muted">
                Link original indisponível
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

type ThumbnailConteudoProps = {
  conteudo: RankingConteudo;
  posicao: number;
};

function ThumbnailConteudo({ conteudo, posicao }: ThumbnailConteudoProps) {
  return (
    <div className="relative aspect-video bg-surface-muted lg:aspect-auto lg:min-h-full">
      {conteudo.thumbnailUrl ? (
        <img
          src={conteudo.thumbnailUrl}
          alt={conteudo.titulo}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full min-h-56 w-full items-center justify-center bg-gradient-to-br from-surface-muted to-surface">
          <Play className="h-12 w-12 text-primary" />
        </div>
      )}

      <Badge variante="danger" className="absolute left-4 top-4">
        #{posicao} Viral
      </Badge>
    </div>
  );
}

type MetricaConteudoProps = {
  label: string;
  valor: string;
  icone: React.ReactNode;
  destaque?: boolean;
};

function MetricaConteudo({
  label,
  valor,
  icone,
  destaque = false,
}: MetricaConteudoProps) {
  return (
    <div className="rounded-xl bg-surface-muted/60 p-3">
      <div className={destaque ? "text-success" : "text-primary"}>{icone}</div>

      <span className="mt-2 block text-xs text-text-muted">{label}</span>

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
