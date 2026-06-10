import { AlertTriangle, CheckCircle2 } from "lucide-react";

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
  const possuiErros = resumoNormalizado.erros.length > 0;

  return (
    <Card className="border-success/30 bg-success/5">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Resumo da coleta
          </CardTitle>

          <Badge variante={possuiErros ? "warning" : "success"}>
            {possuiErros ? "Concluída com avisos" : "Concluída"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {resumo.mensagem && (
          <p className="text-sm text-text-secondary">{resumo.mensagem}</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricaResumo
            titulo="Vídeos encontrados"
            valor={resumoNormalizado.videosEncontrados}
          />

          <MetricaResumo
            titulo="Canais processados"
            valor={resumoNormalizado.canaisProcessados}
          />

          <MetricaResumo
            titulo="Influenciadores criados"
            valor={resumoNormalizado.influenciadoresCriados}
          />

          <MetricaResumo
            titulo="Influenciadores atualizados"
            valor={resumoNormalizado.influenciadoresAtualizados}
          />

          <MetricaResumo
            titulo="Conteúdos criados"
            valor={resumoNormalizado.conteudosCriados}
          />

          <MetricaResumo
            titulo="Conteúdos atualizados"
            valor={resumoNormalizado.conteudosAtualizados}
          />
        </div>

        {possuiErros && (
          <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4">
            <div className="mb-3 flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              <strong>Erros ou avisos da coleta</strong>
            </div>

            <ul className="space-y-2 text-sm text-text-secondary">
              {resumoNormalizado.erros.map((erro) => (
                <li key={erro}>• {erro}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type MetricaResumoProps = {
  titulo: string;
  valor: number | null;
};

function MetricaResumo({ titulo, valor }: MetricaResumoProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface/80 p-4">
      <span className="text-sm text-text-muted">{titulo}</span>

      <p className="mt-2 text-2xl font-extrabold text-text-primary">
        {valor ?? "N/D"}
      </p>
    </div>
  );
}
