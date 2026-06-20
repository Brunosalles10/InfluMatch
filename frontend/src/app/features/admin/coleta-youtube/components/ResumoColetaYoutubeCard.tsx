import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/app/components/ui/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import type { ResumoColetaYoutube } from "@/app/types/youtube.types";
import { NormalizadorResumoYoutube } from "../utils/NormalizadorResumoYoutube";

type ResumoColetaYoutubeCardProps = {
  resumo: ResumoColetaYoutube;
};

export function ResumoColetaYoutubeCard({
  resumo,
}: ResumoColetaYoutubeCardProps) {
  const resumoNormalizado = NormalizadorResumoYoutube.normalizar(resumo);

  return (
    <Card className="border-success/30 bg-success/5">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Resumo da coleta
          </CardTitle>

          <Badge
            variante={
              resumoNormalizado.retornadoDoCache ? "primary" : "success"
            }
          >
            {resumoNormalizado.statusLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-sm text-text-secondary">
          {resumoNormalizado.mensagem}
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <InformacaoResumo
            titulo="Plataforma"
            valor={resumoNormalizado.plataforma}
          />

          <InformacaoResumo
            titulo="Nicho"
            valor={resumoNormalizado.nichoNome}
          />

          <InformacaoResumo
            titulo="Slug do nicho"
            valor={resumoNormalizado.nichoSlug}
          />

          <InformacaoResumo
            titulo="Atualizado em"
            valor={resumoNormalizado.atualizadoEmFormatado}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricaResumo
            titulo="Vídeos encontrados"
            valor={resumoNormalizado.totalVideosEncontrados}
          />

          <MetricaResumo
            titulo="Canais processados"
            valor={resumoNormalizado.totalCanaisProcessados}
          />

          <MetricaResumo
            titulo="Conteúdos processados"
            valor={resumoNormalizado.totalConteudosProcessados}
          />
        </div>

        {resumoNormalizado.retornadoDoCache && (
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm text-text-secondary">
            Esta resposta veio do cache da última coleta para o mesmo nicho e
            quantidade de resultados.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type InformacaoResumoProps = {
  titulo: string;
  valor: string;
};

function InformacaoResumo({ titulo, valor }: InformacaoResumoProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface/80 p-4">
      <span className="text-sm text-text-muted">{titulo}</span>

      <p className="mt-2 break-words text-base font-bold text-text-primary">
        {valor}
      </p>
    </div>
  );
}

type MetricaResumoProps = {
  titulo: string;
  valor: number;
};

function MetricaResumo({ titulo, valor }: MetricaResumoProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface/80 p-4">
      <span className="text-sm text-text-muted">{titulo}</span>

      <p className="mt-2 text-2xl font-extrabold text-text-primary">{valor}</p>
    </div>
  );
}
