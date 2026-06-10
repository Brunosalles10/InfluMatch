import type { RespostaPaginada } from "@/app/types/api.types";
import type {
  FiltrosRankingConteudos,
  FiltrosRankingInfluenciadores,
  RankingConteudo,
  RankingInfluenciador,
} from "@/app/types/ranking.types";
import { ServicoApiBase } from "../api/ServicoApiBase";

class RankingsService extends ServicoApiBase {
  async buscarRankingConteudos(filtros: FiltrosRankingConteudos = {}) {
    return this.buscar<RespostaPaginada<RankingConteudo>>(
      "/rankings/conteudos",
      filtros,
    );
  }

  async buscarRankingInfluenciadores(
    filtros: FiltrosRankingInfluenciadores = {},
  ) {
    return this.buscar<RespostaPaginada<RankingInfluenciador>>(
      "/rankings/influenciadores",
      filtros,
    );
  }
}

export const rankingsService = new RankingsService();
