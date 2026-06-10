import type { ResumoColetaYoutube } from "@/app/services/types/youtube.types";

type ResumoNormalizado = {
  videosEncontrados: number | null;
  canaisProcessados: number | null;
  influenciadoresCriados: number | null;
  influenciadoresAtualizados: number | null;
  conteudosCriados: number | null;
  conteudosAtualizados: number | null;
  erros: string[];
};

export class NormalizadorResumoYoutube {
  static normalizar(resumo: ResumoColetaYoutube): ResumoNormalizado {
    return {
      videosEncontrados: this.obterNumero(resumo, [
        "videosEncontrados",
        "quantidadeVideosEncontrados",
        "totalVideosEncontrados",
      ]),
      canaisProcessados: this.obterNumero(resumo, [
        "canaisProcessados",
        "quantidadeCanaisProcessados",
        "totalCanaisProcessados",
      ]),
      influenciadoresCriados: this.obterNumero(resumo, [
        "influenciadoresCriados",
        "quantidadeInfluenciadoresCriados",
      ]),
      influenciadoresAtualizados: this.obterNumero(resumo, [
        "influenciadoresAtualizados",
        "quantidadeInfluenciadoresAtualizados",
      ]),
      conteudosCriados: this.obterNumero(resumo, [
        "conteudosCriados",
        "quantidadeConteudosCriados",
      ]),
      conteudosAtualizados: this.obterNumero(resumo, [
        "conteudosAtualizados",
        "quantidadeConteudosAtualizados",
      ]),
      erros: this.obterErros(resumo),
    };
  }

  private static obterNumero(resumo: ResumoColetaYoutube, chaves: string[]) {
    for (const chave of chaves) {
      const valor = resumo[chave];

      if (typeof valor === "number") {
        return valor;
      }

      if (typeof valor === "string" && valor.trim() !== "") {
        const numero = Number(valor);

        if (Number.isFinite(numero)) {
          return numero;
        }
      }
    }

    return null;
  }

  private static obterErros(resumo: ResumoColetaYoutube) {
    if (Array.isArray(resumo.erros)) {
      return resumo.erros.filter(
        (erro): erro is string => typeof erro === "string",
      );
    }

    return [];
  }
}
