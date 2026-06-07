import type { DadosFiltroBuscaHome } from "@/app/schemas";

type FiltrosBuscaHome = Pick<DadosFiltroBuscaHome, "busca" | "nicho">;

export class ConstrutorRotasHome {
  static criarRotaCriadores(filtros: FiltrosBuscaHome) {
    const queryString = this.montarQueryString({
      busca: filtros.busca,
      nicho: filtros.nicho,
    });

    return `/criadores${queryString}`;
  }

  static criarRotaVideosVirais(filtros: FiltrosBuscaHome) {
    const queryString = this.montarQueryString({
      busca: filtros.busca,
      nicho: filtros.nicho,
      plataforma: "YOUTUBE",
    });

    return `/videos-virais${queryString}`;
  }

  private static montarQueryString(
    parametros: Record<string, string | undefined>,
  ) {
    const queryParams = new URLSearchParams();

    Object.entries(parametros).forEach(([chave, valor]) => {
      const valorNormalizado = this.normalizarTexto(valor);

      if (valorNormalizado) {
        queryParams.set(chave, valorNormalizado);
      }
    });

    const queryString = queryParams.toString();

    return queryString ? `?${queryString}` : "";
  }

  private static normalizarTexto(valor?: string) {
    const texto = valor?.trim();

    return texto ? texto : undefined;
  }
}
