import { bigIntParaNumero } from 'src/common/utils/bigint.util';

export class RankingInfluenciadorMapper {
  static paraResposta(perfil: any, posicao: number, mediaEngajamento = 0) {
    const influenciador = perfil.influenciador;
    const nicho = influenciador?.nicho;
    const totalVisualizacoes = bigIntParaNumero(perfil.totalVisualizacoes);
    const totalConteudos = perfil.totalConteudos || 0;

    return {
      posicao,
      perfilSocialId: perfil.id,
      influenciadorId: influenciador?.id,
      nome: influenciador?.nome,
      descricao: influenciador?.descricao,
      imagemUrl: influenciador?.imagemUrl,
      plataforma: perfil.plataforma,
      identificadorExterno: perfil.identificadorExterno,
      nomeUsuario: perfil.nomeUsuario,
      urlPerfil: perfil.urlPerfil,
      totalSeguidores: bigIntParaNumero(perfil.totalSeguidores),
      totalVisualizacoes,
      totalConteudos,
      mediaViewsPorConteudo:
        totalConteudos > 0
          ? Math.round(totalVisualizacoes / totalConteudos)
          : 0,
      mediaEngajamento,
      ultimaSincronizacaoEm: perfil.ultimaSincronizacaoEm,
      nicho: nicho
        ? {
            id: nicho.id,
            nome: nicho.nome,
            slug: nicho.slug,
          }
        : null,
      criadoEm: perfil.criadoEm,
      atualizadoEm: perfil.atualizadoEm,
    };
  }
}
