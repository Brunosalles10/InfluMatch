import { type Plataforma, type Prisma } from '@prisma/client';
import { bigIntParaNumero } from 'src/common/utils/bigint.util';

export type InfluenciadorComRelacoes = Prisma.InfluenciadorGetPayload<{
  include: {
    nicho: true;
    perfisSociais: true;
  };
}>;

export interface InfluenciadorResponse {
  id: string;
  nome: string;
  descricao: string | null;
  imagemUrl: string | null;
  nicho: {
    id: string;
    nome: string;
    slug: string;
  } | null;
  perfisSociais: {
    id: string;
    plataforma: Plataforma;
    identificadorExterno: string;
    nomeUsuario: string;
    urlPerfil: string | null;
    totalSeguidores: number;
    totalVisualizacoes: number;
    totalConteudos: number;
    ultimaSincronizacaoEm: Date | null;
  }[];
  criadoEm: Date;
  atualizadoEm: Date;
}

export class InfluenciadorMapper {
  /**
   * Converte o influenciador retornado pelo Prisma no formato usado pela API.
   */
  static paraResposta(
    influenciador: InfluenciadorComRelacoes,
  ): InfluenciadorResponse {
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
      perfisSociais: influenciador.perfisSociais.map((perfil) => ({
        id: perfil.id,
        plataforma: perfil.plataforma,
        identificadorExterno: perfil.identificadorExterno,
        nomeUsuario: perfil.nomeUsuario,
        urlPerfil: perfil.urlPerfil,
        totalSeguidores: bigIntParaNumero(perfil.totalSeguidores),
        totalVisualizacoes: bigIntParaNumero(perfil.totalVisualizacoes),
        totalConteudos: perfil.totalConteudos,
        ultimaSincronizacaoEm: perfil.ultimaSincronizacaoEm,
      })),
      criadoEm: influenciador.criadoEm,
      atualizadoEm: influenciador.atualizadoEm,
    };
  }
}
