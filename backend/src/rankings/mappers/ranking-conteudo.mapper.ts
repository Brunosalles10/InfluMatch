import { bigIntParaNumero } from 'src/common/utils/bigint.util';

export class RankingConteudoMapper {
  static paraResposta(conteudo: any, posicao: number) {
    const perfilSocial = conteudo.perfilSocial;
    const influenciador = perfilSocial?.influenciador;
    const nicho = influenciador?.nicho;

    return {
      posicao,
      id: conteudo.id,
      titulo: conteudo.titulo,
      descricao: conteudo.descricao,
      plataforma: conteudo.plataforma,
      tipoConteudo: conteudo.tipoConteudo,
      urlConteudo: conteudo.urlConteudo,
      urlThumbnail: conteudo.urlThumbnail,
      totalViews: bigIntParaNumero(conteudo.totalViews),
      totalLikes: bigIntParaNumero(conteudo.totalLikes),
      totalComentarios: bigIntParaNumero(conteudo.totalComentarios),
      taxaEngajamento: conteudo.taxaEngajamento,
      publicadoEm: conteudo.publicadoEm,
      perfilSocial: perfilSocial
        ? {
            id: perfilSocial.id,
            nomeUsuario: perfilSocial.nomeUsuario,
            urlPerfil: perfilSocial.urlPerfil,
          }
        : null,
      influenciador: influenciador
        ? {
            id: influenciador.id,
            nome: influenciador.nome,
            imagemUrl: influenciador.imagemUrl,
          }
        : null,
      nicho: nicho
        ? {
            id: nicho.id,
            nome: nicho.nome,
            slug: nicho.slug,
          }
        : null,
      criadoEm: conteudo.criadoEm,
      atualizadoEm: conteudo.atualizadoEm,
    };
  }
}
