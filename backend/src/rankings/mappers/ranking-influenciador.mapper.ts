import { type Plataforma, type Prisma } from '@prisma/client';
import { bigIntParaNumero } from 'src/common/utils/bigint.util';

export type RankingInfluenciadorComRelacoes = Prisma.PerfilSocialGetPayload<{
  include: {
    influenciador: {
      include: {
        nicho: true;
      };
    };
  };
}>;

export interface RankingInfluenciadorResponse {
  posicao: number;
  perfilSocialId: string;
  influenciadorId: string;
  nome: string;
  descricao: string | null;
  imagemUrl: string | null;
  plataforma: Plataforma;
  identificadorExterno: string;
  nomeUsuario: string;
  urlPerfil: string | null;
  totalSeguidores: number;
  totalVisualizacoes: number;
  totalConteudos: number;
  mediaViewsPorConteudo: number;
  mediaEngajamento: number;
  ultimaSincronizacaoEm: Date | null;
  nicho: {
    id: string;
    nome: string;
    slug: string;
  } | null;
  criadoEm: Date;
  atualizadoEm: Date;
}

export class RankingInfluenciadorMapper {
  /**
   * Converte o perfil social retornado pelo Prisma no formato usado pela API.
   */
  static paraResposta(
    perfil: RankingInfluenciadorComRelacoes,
    posicao: number,
    mediaEngajamento = 0,
  ): RankingInfluenciadorResponse {
    const influenciador = perfil.influenciador;
    const nicho = influenciador.nicho;
    const totalVisualizacoes = bigIntParaNumero(perfil.totalVisualizacoes);
    const totalConteudos = perfil.totalConteudos;

    return {
      posicao,
      perfilSocialId: perfil.id,
      influenciadorId: influenciador.id,
      nome: influenciador.nome,
      descricao: influenciador.descricao,
      imagemUrl: influenciador.imagemUrl,
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
