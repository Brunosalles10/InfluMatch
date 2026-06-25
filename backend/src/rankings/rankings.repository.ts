import { Injectable } from '@nestjs/common';
import { Plataforma, Prisma, TipoConteudo } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdenacaoRankingConteudo } from './dto/filtro-ranking-conteudos.dto';
import { OrdenacaoRankingInfluenciador } from './dto/filtro-ranking-influenciadores.dto';

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

export type RankingInfluenciadorComRelacoes = Prisma.PerfilSocialGetPayload<{
  include: {
    influenciador: {
      include: {
        nicho: true;
      };
    };
  };
}>;

interface ResultadoPaginado<T> {
  data: T[];
  total: number;
}

interface RankingConteudosParams {
  plataforma?: Plataforma;
  tipoConteudo?: TipoConteudo;
  nicho?: string;
  busca?: string;
  ordenarPor: OrdenacaoRankingConteudo;
  page: number;
  limit: number;
}

interface RankingInfluenciadoresParams {
  plataforma?: Plataforma;
  nicho?: string;
  busca?: string;
  ordenarPor: OrdenacaoRankingInfluenciador;
  page: number;
  limit: number;
}

@Injectable()
export class RankingsRepository {
  private readonly ordenacoesConteudos: Record<
    OrdenacaoRankingConteudo,
    Prisma.ConteudoOrderByWithRelationInput[]
  > = {
    [OrdenacaoRankingConteudo.VIEWS]: [
      { totalViews: 'desc' },
      { taxaEngajamento: 'desc' },
    ],
    [OrdenacaoRankingConteudo.ENGAJAMENTO]: [
      { taxaEngajamento: 'desc' },
      { totalViews: 'desc' },
    ],
    [OrdenacaoRankingConteudo.RECENTE]: [
      { publicadoEm: 'desc' },
      { totalViews: 'desc' },
    ],
    [OrdenacaoRankingConteudo.VIRAL]: [
      { taxaEngajamento: 'desc' },
      { totalViews: 'desc' },
      { totalLikes: 'desc' },
      { totalComentarios: 'desc' },
    ],
  };

  private readonly ordenacoesInfluenciadores: Record<
    OrdenacaoRankingInfluenciador,
    Prisma.PerfilSocialOrderByWithRelationInput[]
  > = {
    [OrdenacaoRankingInfluenciador.VISUALIZACOES]: [
      { totalVisualizacoes: 'desc' },
      { totalSeguidores: 'desc' },
    ],
    [OrdenacaoRankingInfluenciador.CONTEUDOS]: [
      { totalConteudos: 'desc' },
      { totalSeguidores: 'desc' },
    ],
    [OrdenacaoRankingInfluenciador.ENGAJAMENTO]: [
      { totalSeguidores: 'desc' },
      { totalVisualizacoes: 'desc' },
    ],
    [OrdenacaoRankingInfluenciador.SEGUIDORES]: [
      { totalSeguidores: 'desc' },
      { totalVisualizacoes: 'desc' },
    ],
  };

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca conteúdos paginados aplicando filtros e ordenação.
   */
  async listarConteudos(
    params: RankingConteudosParams,
  ): Promise<ResultadoPaginado<RankingConteudoComRelacoes>> {
    const { plataforma, tipoConteudo, nicho, busca, ordenarPor, page, limit } =
      params;

    const skip = (page - 1) * limit;
    const nichoSlug = nicho ? this.normalizarSlug(nicho) : undefined;

    const where: Prisma.ConteudoWhereInput = {
      ...(plataforma ? { plataforma } : {}),
      ...(tipoConteudo ? { tipoConteudo } : {}),
      ...(busca
        ? {
            OR: [
              { titulo: { contains: busca } },
              { descricao: { contains: busca } },
              { perfilSocial: { nomeUsuario: { contains: busca } } },
              {
                perfilSocial: {
                  influenciador: {
                    nome: { contains: busca },
                  },
                },
              },
            ],
          }
        : {}),
      ...(nicho
        ? {
            perfilSocial: {
              influenciador: {
                nicho: {
                  OR: [{ slug: nichoSlug }, { nome: { contains: nicho } }],
                },
              },
            },
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.conteudo.findMany({
        where,
        skip,
        take: limit,
        include: {
          perfilSocial: {
            include: {
              influenciador: {
                include: {
                  nicho: true,
                },
              },
            },
          },
        },
        orderBy: this.montarOrdenacaoConteudos(ordenarPor),
      }),
      this.prisma.conteudo.count({ where }),
    ]);

    return { data, total };
  }

  /**
   * Busca perfis sociais paginados aplicando filtros e ordenação.
   */
  async listarInfluenciadores(
    params: RankingInfluenciadoresParams,
  ): Promise<ResultadoPaginado<RankingInfluenciadorComRelacoes>> {
    const { plataforma, nicho, busca, ordenarPor, page, limit } = params;

    const skip = (page - 1) * limit;
    const nichoSlug = nicho ? this.normalizarSlug(nicho) : undefined;

    const where: Prisma.PerfilSocialWhereInput = {
      ...(plataforma ? { plataforma } : {}),
      ...(busca
        ? {
            OR: [
              { nomeUsuario: { contains: busca } },
              { identificadorExterno: { contains: busca } },
              {
                influenciador: {
                  nome: { contains: busca },
                },
              },
            ],
          }
        : {}),
      ...(nicho
        ? {
            influenciador: {
              nicho: {
                OR: [{ slug: nichoSlug }, { nome: { contains: nicho } }],
              },
            },
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.perfilSocial.findMany({
        where,
        skip,
        take: limit,
        include: {
          influenciador: {
            include: {
              nicho: true,
            },
          },
        },
        orderBy: this.montarOrdenacaoInfluenciadores(ordenarPor),
      }),
      this.prisma.perfilSocial.count({ where }),
    ]);

    return { data, total };
  }

  /**
   * Calcula a média de engajamento dos conteúdos agrupada por perfil social.
   */
  async buscarMediasEngajamentoPorPerfis(
    perfilSocialIds: string[],
  ): Promise<Map<string, number>> {
    if (perfilSocialIds.length === 0) {
      return new Map<string, number>();
    }

    const medias = await this.prisma.conteudo.groupBy({
      by: ['perfilSocialId'],
      where: {
        perfilSocialId: {
          in: perfilSocialIds,
        },
      },
      _avg: {
        taxaEngajamento: true,
      },
    });

    return new Map(
      medias.map((media) => [
        media.perfilSocialId,
        Number((media._avg.taxaEngajamento ?? 0).toFixed(2)),
      ]),
    );
  }

  /**
   * Retorna a ordenação de conteúdos correspondente ao filtro recebido.
   */
  private montarOrdenacaoConteudos(
    ordenarPor: OrdenacaoRankingConteudo,
  ): Prisma.ConteudoOrderByWithRelationInput[] {
    return this.ordenacoesConteudos[ordenarPor];
  }

  /**
   * Retorna a ordenação de influenciadores correspondente ao filtro recebido.
   */
  private montarOrdenacaoInfluenciadores(
    ordenarPor: OrdenacaoRankingInfluenciador,
  ): Prisma.PerfilSocialOrderByWithRelationInput[] {
    return this.ordenacoesInfluenciadores[ordenarPor];
  }

  /**
   * Normaliza um texto para o mesmo formato de slug usado nos nichos.
   */
  private normalizarSlug(valor: string): string {
    return valor
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}
