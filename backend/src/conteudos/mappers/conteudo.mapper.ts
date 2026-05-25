import { bigIntParaNumero } from 'src/common/utils/bigint.util';

export class ConteudoMapper {
  static paraResposta(conteudo: any) {
    return {
      id: conteudo.id,
      plataforma: conteudo.plataforma,
      tipoConteudo: conteudo.tipoConteudo,
      identificadorExterno: conteudo.identificadorExterno,
      titulo: conteudo.titulo,
      descricao: conteudo.descricao,
      urlConteudo: conteudo.urlConteudo,
      urlThumbnail: conteudo.urlThumbnail,
      totalViews: bigIntParaNumero(conteudo.totalViews),
      totalLikes: bigIntParaNumero(conteudo.totalLikes),
      totalComentarios: bigIntParaNumero(conteudo.totalComentarios),
      taxaEngajamento: conteudo.taxaEngajamento,
      publicadoEm: conteudo.publicadoEm,
      perfilSocial: conteudo.perfilSocial
        ? {
            id: conteudo.perfilSocial.id,
            nomeUsuario: conteudo.perfilSocial.nomeUsuario,
            plataforma: conteudo.perfilSocial.plataforma,
            urlPerfil: conteudo.perfilSocial.urlPerfil,
            influenciador: conteudo.perfilSocial.influenciador
              ? {
                  id: conteudo.perfilSocial.influenciador.id,
                  nome: conteudo.perfilSocial.influenciador.nome,
                  imagemUrl: conteudo.perfilSocial.influenciador.imagemUrl,
                  nicho: conteudo.perfilSocial.influenciador.nicho
                    ? {
                        id: conteudo.perfilSocial.influenciador.nicho.id,
                        nome: conteudo.perfilSocial.influenciador.nicho.nome,
                        slug: conteudo.perfilSocial.influenciador.nicho.slug,
                      }
                    : null,
                }
              : null,
          }
        : null,
      criadoEm: conteudo.criadoEm,
      atualizadoEm: conteudo.atualizadoEm,
    };
  }
}
