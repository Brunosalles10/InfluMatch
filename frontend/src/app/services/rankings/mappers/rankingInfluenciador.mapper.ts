import type { RankingInfluenciador } from "@/app/types/ranking.types";
import type { RankingInfluenciadorBackend } from "./ranking-backend.types";

export class RankingInfluenciadorFrontendMapper {
  static paraFrontend(
    influenciador: RankingInfluenciadorBackend,
  ): RankingInfluenciador {
    return {
      id: influenciador.perfilSocialId,
      nome: influenciador.nome ?? "Criador sem nome",
      username: obterTextoOuUndefined(influenciador.nomeUsuario),
      imagemUrl: obterTextoOuUndefined(influenciador.imagemUrl),
      plataforma: influenciador.plataforma,
      nicho: obterTextoOuUndefined(influenciador.nicho?.nome),
      seguidores: obterNumeroOuUndefined(influenciador.totalSeguidores),
      visualizacoes: obterNumeroOuUndefined(influenciador.totalVisualizacoes),
      quantidadeConteudos: obterNumeroOuUndefined(influenciador.totalConteudos),
      taxaEngajamento: obterNumeroOuUndefined(influenciador.mediaEngajamento),
      mediaVisualizacoesPorConteudo: obterNumeroOuUndefined(
        influenciador.mediaViewsPorConteudo,
      ),
    };
  }
}

function obterNumeroOuUndefined(valor?: number | null) {
  return valor ?? undefined;
}

function obterTextoOuUndefined(valor?: string | null) {
  return valor ?? undefined;
}
