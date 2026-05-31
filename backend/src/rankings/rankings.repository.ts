import { Injectable } from '@nestjs/common';
import { Plataforma, Prisma, TipoConteudo } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdenacaoRankingConteudo } from './dto/filtro-ranking-conteudos.dto';
import { OrdenacaoRankingInfluenciador } from './dto/filtro-ranking-influenciadores.dto';

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
  constructor(private readonly prisma: PrismaService) {}

  async listarConteudos(params: RankingConteudosParams) {
    const { plataforma, tipoConteudo, nicho, busca, ordenarPor, page, limit } =
      params;
    const skip = (page - 1) * limit;

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
                  influenciador: { nome: { contains: busca } },
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
                  slug: nicho,
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
                include: { nicho: true },
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

  async listarInfluenciadores(params: RankingInfluenciadoresParams) {
    const { plataforma, nicho, busca, ordenarPor, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.PerfilSocialWhereInput = {
      ...(plataforma ? { plataforma } : {}),
      ...(busca
        ? {
            OR: [
              { nomeUsuario: { contains: busca } },
              { identificadorExterno: { contains: busca } },
              { influenciador: { nome: { contains: busca } } },
            ],
          }
        : {}),
      ...(nicho
        ? {
            influenciador: {
              nicho: {
                slug: nicho,
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
            include: { nicho: true },
          },
        },
        orderBy: this.montarOrdenacaoInfluenciadores(ordenarPor),
      }),
      this.prisma.perfilSocial.count({ where }),
    ]);

    return { data, total };
  }

  async buscarMediasEngajamentoPorPerfis(perfilSocialIds: string[]) {
    if (perfilSocialIds.length === 0) return new Map<string, number>();

    const medias = await this.prisma.conteudo.groupBy({
      by: ['perfilSocialId'],
      where: {
        perfilSocialId: { in: perfilSocialIds },
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

  private montarOrdenacaoConteudos(
    ordenarPor: OrdenacaoRankingConteudo,
  ): Prisma.ConteudoOrderByWithRelationInput[] {
    switch (ordenarPor) {
      case OrdenacaoRankingConteudo.VIEWS:
        return [{ totalViews: 'desc' }, { taxaEngajamento: 'desc' }];
      case OrdenacaoRankingConteudo.ENGAJAMENTO:
        return [{ taxaEngajamento: 'desc' }, { totalViews: 'desc' }];
      case OrdenacaoRankingConteudo.RECENTE:
        return [{ publicadoEm: 'desc' }, { totalViews: 'desc' }];
      case OrdenacaoRankingConteudo.VIRAL:
      default:
        return [
          { taxaEngajamento: 'desc' },
          { totalViews: 'desc' },
          { totalLikes: 'desc' },
          { totalComentarios: 'desc' },
        ];
    }
  }

  private montarOrdenacaoInfluenciadores(
    ordenarPor: OrdenacaoRankingInfluenciador,
  ): Prisma.PerfilSocialOrderByWithRelationInput[] {
    switch (ordenarPor) {
      case OrdenacaoRankingInfluenciador.VISUALIZACOES:
        return [{ totalVisualizacoes: 'desc' }, { totalSeguidores: 'desc' }];
      case OrdenacaoRankingInfluenciador.CONTEUDOS:
        return [{ totalConteudos: 'desc' }, { totalSeguidores: 'desc' }];
      case OrdenacaoRankingInfluenciador.ENGAJAMENTO:
        return [{ totalSeguidores: 'desc' }, { totalVisualizacoes: 'desc' }];
      case OrdenacaoRankingInfluenciador.SEGUIDORES:
      default:
        return [{ totalSeguidores: 'desc' }, { totalVisualizacoes: 'desc' }];
    }
  }
}
