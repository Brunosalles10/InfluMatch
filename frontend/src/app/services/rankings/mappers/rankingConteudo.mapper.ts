import type { RankingConteudo } from "@/app/types/ranking.types";
import type { RankingConteudoBackend } from "./ranking-backend.types";

export class RankingConteudoFrontendMapper {
  static paraFrontend(conteudo: RankingConteudoBackend): RankingConteudo {
    return {
      id: conteudo.id,
      titulo: conteudo.titulo,
      plataforma: conteudo.plataforma,
      tipoConteudo: conteudo.tipoConteudo,
      thumbnailUrl: conteudo.urlThumbnail,
      urlOriginal: conteudo.urlConteudo,
      nomeCriador: conteudo.influenciador?.nome,
      usernameCriador: conteudo.perfilSocial?.nomeUsuario,
      nicho: conteudo.nicho?.nome,
      visualizacoes: conteudo.totalViews,
      curtidas: conteudo.totalLikes,
      comentarios: conteudo.totalComentarios,
      taxaEngajamento: conteudo.taxaEngajamento,
      publicadoEm: conteudo.publicadoEm,
    };
  }
}
