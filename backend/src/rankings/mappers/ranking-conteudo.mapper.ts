import {
  type Plataforma,
  type Prisma,
  type TipoConteudo,
} from '@prisma/client';
import { bigIntParaNumero } from 'src/common/utils/bigint.util';

export type RankingConteudoComRelacoes = Prisma.ConteudoGetPayload<{
  include: {
    perfilSocial: {
      include: {
        influenciador: {
          include: {
            nicho: true;
          };
        };
      };
    };
  };
}>;

export interface RankingConteudoResponse {
  posicao: number;
  id: string;
  titulo: string;
  descricao: string | null;
  plataforma: Plataforma;
  tipoConteudo: TipoConteudo;
  urlConteudo: string | null;
  urlThumbnail: string | null;
  totalViews: number;
  totalLikes: number;
  totalComentarios: number;
  taxaEngajamento: number;
  publicadoEm: Date | null;
  perfilSocial: {
    id: string;
    nomeUsuario: string;
    urlPerfil: string | null;
  };
  influenciador: {
    id: string;
    nome: string;
    imagemUrl: string | null;
  };
  nicho: {
    id: string;
    nome: string;
    slug: string;
  } | null;
  criadoEm: Date;
  atualizadoEm: Date;
}

export class RankingConteudoMapper {
  /**
   * Converte o conteúdo retornado pelo Prisma no formato usado pela API.
   */
  static paraResposta(
    conteudo: RankingConteudoComRelacoes,
    posicao: number,
  ): RankingConteudoResponse {
    const perfilSocial = conteudo.perfilSocial;
    const influenciador = perfilSocial.influenciador;
    const nicho = influenciador.nicho;

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
      perfilSocial: {
        id: perfilSocial.id,
        nomeUsuario: perfilSocial.nomeUsuario,
        urlPerfil: perfilSocial.urlPerfil,
      },
      influenciador: {
        id: influenciador.id,
        nome: influenciador.nome,
        imagemUrl: influenciador.imagemUrl,
      },
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
