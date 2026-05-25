import { bigIntParaNumero } from 'src/common/utils/bigint.util';

export class PerfilSocialMapper {
  static paraResposta(perfil: any) {
    return {
      id: perfil.id,
      plataforma: perfil.plataforma,
      identificadorExterno: perfil.identificadorExterno,
      nomeUsuario: perfil.nomeUsuario,
      urlPerfil: perfil.urlPerfil,
      totalSeguidores: bigIntParaNumero(perfil.totalSeguidores),
      totalVisualizacoes: bigIntParaNumero(perfil.totalVisualizacoes),
      totalConteudos: perfil.totalConteudos,
      ultimaSincronizacaoEm: perfil.ultimaSincronizacaoEm,
      influenciador: perfil.influenciador
        ? {
            id: perfil.influenciador.id,
            nome: perfil.influenciador.nome,
            imagemUrl: perfil.influenciador.imagemUrl,
            nicho: perfil.influenciador.nicho
              ? {
                  id: perfil.influenciador.nicho.id,
                  nome: perfil.influenciador.nicho.nome,
                  slug: perfil.influenciador.nicho.slug,
                }
              : null,
          }
        : null,
      criadoEm: perfil.criadoEm,
      atualizadoEm: perfil.atualizadoEm,
    };
  }
}
