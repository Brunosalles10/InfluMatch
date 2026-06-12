import type { RespostaPaginada } from "@/app/types/api.types";
import type {
  FiltrosRankingConteudos,
  FiltrosRankingInfluenciadores,
} from "@/app/types/ranking.types";
import { ServicoApiBase } from "../api/ServicoApiBase";
import type {
  RankingConteudoBackend,
  RankingInfluenciadorBackend,
  RespostaRankingBackend,
} from "./mappers/ranking-backend.types";
import { RankingConteudoFrontendMapper } from "./mappers/rankingConteudo.mapper";
import { RankingInfluenciadorFrontendMapper } from "./mappers/rankingInfluenciador.mapper";

class RankingsService extends ServicoApiBase {
  async buscarRankingConteudos(filtros: FiltrosRankingConteudos = {}) {
    const resposta = await this.buscar<
      RespostaRankingBackend<RankingConteudoBackend>
    >("/rankings/conteudos", filtros);

    return this.normalizarRespostaPaginada(
      resposta,
      resposta.data.map((conteudo) =>
        RankingConteudoFrontendMapper.paraFrontend(conteudo),
      ),
    );
  }

  async buscarRankingInfluenciadores(
    filtros: FiltrosRankingInfluenciadores = {},
  ) {
    const resposta = await this.buscar<
      RespostaRankingBackend<RankingInfluenciadorBackend>
    >("/rankings/influenciadores", filtros);

    return this.normalizarRespostaPaginada(
      resposta,
      resposta.data.map((influenciador) =>
        RankingInfluenciadorFrontendMapper.paraFrontend(influenciador),
      ),
    );
  }

  private normalizarRespostaPaginada<T>(
    resposta: RespostaRankingBackend<unknown>,
    data: T[],
  ): RespostaPaginada<T> {
    return {
      data,
      total: resposta.total,
      page: resposta.page,
      limit: resposta.limit,
      totalPages: resposta.totalPages ?? resposta.lastPage,
    };
  }
}

export const rankingsService = new RankingsService();
