import { bigIntParaNumero } from 'src/common/utils/bigint.util';

export class InfluenciadorMapper {
  static paraResposta(influenciador: any) {
    return {
      id: influenciador.id,
      nome: influenciador.nome,
      descricao: influenciador.descricao,
      imagemUrl: influenciador.imagemUrl,
      nicho: influenciador.nicho
        ? {
            id: influenciador.nicho.id,
            nome: influenciador.nicho.nome,
            slug: influenciador.nicho.slug,
          }
        : null,
      perfisSociais:
        influenciador.perfisSociais?.map((perfil: any) => ({
          id: perfil.id,
          plataforma: perfil.plataforma,
          identificadorExterno: perfil.identificadorExterno,
          nomeUsuario: perfil.nomeUsuario,
          urlPerfil: perfil.urlPerfil,
          totalSeguidores: bigIntParaNumero(perfil.totalSeguidores),
          totalVisualizacoes: bigIntParaNumero(perfil.totalVisualizacoes),
          totalConteudos: perfil.totalConteudos,
          ultimaSincronizacaoEm: perfil.ultimaSincronizacaoEm,
        })) ?? [],
      criadoEm: influenciador.criadoEm,
      atualizadoEm: influenciador.atualizadoEm,
    };
  }
}
