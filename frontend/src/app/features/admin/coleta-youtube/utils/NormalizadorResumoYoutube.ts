import type { ResumoColetaYoutube } from "@/app/types/youtube.types";

export type ResumoYoutubeNormalizado = {
  mensagem: string;
  plataforma: string;
  nichoNome: string;
  nichoSlug: string;
  totalVideosEncontrados: number;
  totalCanaisProcessados: number;
  totalConteudosProcessados: number;
  retornadoDoCache: boolean;
  statusLabel: string;
  atualizadoEmFormatado: string;
};

export class NormalizadorResumoYoutube {
  static normalizar(resumo: ResumoColetaYoutube): ResumoYoutubeNormalizado {
    return {
      mensagem: resumo.mensagem,
      plataforma: this.formatarPlataforma(resumo.plataforma),
      nichoNome: resumo.nicho.nome,
      nichoSlug: resumo.nicho.slug,
      totalVideosEncontrados: resumo.totalVideosEncontrados,
      totalCanaisProcessados: resumo.totalCanaisProcessados,
      totalConteudosProcessados: resumo.totalConteudosProcessados,
      retornadoDoCache: resumo.retornadoDoCache,
      statusLabel: resumo.retornadoDoCache
        ? "Retornado do cache"
        : "Nova coleta",
      atualizadoEmFormatado: this.formatarDataHora(resumo.atualizadoEm),
    };
  }

  private static formatarPlataforma(
    plataforma: ResumoColetaYoutube["plataforma"],
  ) {
    const labels: Record<ResumoColetaYoutube["plataforma"], string> = {
      YOUTUBE: "YouTube",
    };

    return labels[plataforma];
  }

  private static formatarDataHora(dataIso: string) {
    const data = new Date(dataIso);

    if (Number.isNaN(data.getTime())) {
      return "Não disponível";
    }

    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(data);
  }
}
