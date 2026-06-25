import { type Plataforma, type Prisma } from '@prisma/client';
import { bigIntParaNumero } from 'src/common/utils/bigint.util';

export type PerfilSocialComRelacoes = Prisma.PerfilSocialGetPayload<{
  include: {
    influenciador: {
      include: {
        nicho: true;
      };
    };
  };
}>;

export interface PerfilSocialResponse {
  id: string;
  plataforma: Plataforma;
  identificadorExterno: string;
  nomeUsuario: string;
  urlPerfil: string | null;
  totalSeguidores: number;
  totalVisualizacoes: number;
  totalConteudos: number;
  ultimaSincronizacaoEm: Date | null;
  influenciador: {
    id: string;
    nome: string;
    imagemUrl: string | null;
    nicho: {
      id: string;
      nome: string;
      slug: string;
    } | null;
  };
  criadoEm: Date;
  atualizadoEm: Date;
}

export class PerfilSocialMapper {
  /**
   * Converte o perfil social retornado pelo Prisma no formato usado pela API.
   */
  static paraResposta(perfil: PerfilSocialComRelacoes): PerfilSocialResponse {
    const influenciador = perfil.influenciador;
    const nicho = influenciador.nicho;

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
      influenciador: {
        id: influenciador.id,
        nome: influenciador.nome,
        imagemUrl: influenciador.imagemUrl,
        nicho: nicho
          ? {
              id: nicho.id,
              nome: nicho.nome,
              slug: nicho.slug,
            }
          : null,
      },
      criadoEm: perfil.criadoEm,
      atualizadoEm: perfil.atualizadoEm,
    };
  }
}
