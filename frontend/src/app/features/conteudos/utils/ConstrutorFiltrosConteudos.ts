import type {
  DadosFiltroRankingConteudos,
  EntradaFiltroRankingConteudos,
} from "@/app/schemas";

type ValorParametro = string | number | boolean | null | undefined;

export class ConstrutorFiltrosConteudos {
  static extrairFiltrosDaUrl(
    searchParams: URLSearchParams,
  ): EntradaFiltroRankingConteudos {
    return {
      plataforma: this.obterParametro(searchParams, "plataforma"),
      tipoConteudo: this.obterParametro(searchParams, "tipoConteudo"),
      nicho: this.obterParametro(searchParams, "nicho"),
      busca: this.obterParametro(searchParams, "busca"),
      ordenarPor: this.obterParametro(searchParams, "ordenarPor"),
      page: this.obterParametro(searchParams, "page"),
      limit: this.obterParametro(searchParams, "limit"),
    };
  }

  static criarSearchParams(filtros: Partial<DadosFiltroRankingConteudos>) {
    const parametros = new URLSearchParams();

    this.adicionarParametro(parametros, "plataforma", filtros.plataforma);
    this.adicionarParametro(parametros, "tipoConteudo", filtros.tipoConteudo);
    this.adicionarParametro(parametros, "nicho", filtros.nicho);
    this.adicionarParametro(parametros, "busca", filtros.busca);
    this.adicionarParametro(parametros, "ordenarPor", filtros.ordenarPor);
    this.adicionarParametro(parametros, "page", filtros.page);
    this.adicionarParametro(parametros, "limit", filtros.limit);

    return parametros;
  }

  private static obterParametro(searchParams: URLSearchParams, chave: string) {
    const valor = searchParams.get(chave);

    return valor ?? undefined;
  }

  private static adicionarParametro(
    parametros: URLSearchParams,
    chave: string,
    valor: ValorParametro,
  ) {
    if (valor === undefined || valor === null || valor === "") {
      return;
    }

    parametros.set(chave, String(valor));
  }
}
