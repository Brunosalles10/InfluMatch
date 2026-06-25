import { Injectable } from '@nestjs/common';
import { type Influenciador, type Plataforma, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import type { InfluenciadorComRelacoes } from './mappers/influenciador.mapper';

interface ListarInfluenciadoresParams {
  busca?: string;
  nicho?: string;
  plataforma?: Plataforma;
  page: number;
  limit: number;
}

interface ResultadoPaginado<T> {
  data: T[];
  total: number;
}

@Injectable()
export class InfluenciadoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Persiste um novo influenciador no banco de dados.
   */
  criar(data: Prisma.InfluenciadorCreateInput): Promise<Influenciador> {
    return this.prisma.influenciador.create({ data });
  }

  /**
   * Atualiza os dados de um influenciador existente.
   */
  atualizar(
    id: string,
    data: Prisma.InfluenciadorUpdateInput,
  ): Promise<Influenciador> {
    return this.prisma.influenciador.update({
      where: { id },
      data,
    });
  }

  /**
   * Busca um influenciador pelo ID incluindo nicho e perfis sociais.
   */
  buscarPorId(id: string): Promise<InfluenciadorComRelacoes | null> {
    return this.prisma.influenciador.findUnique({
      where: { id },
      include: {
        nicho: true,
        perfisSociais: true,
      },
    });
  }

  /**
   * Busca um influenciador pelo nome dentro de um nicho específico.
   */
  buscarPorNomeENicho(
    nome: string,
    nichoId?: string | null,
  ): Promise<Influenciador | null> {
    return this.prisma.influenciador.findFirst({
      where: {
        nome,
        nichoId: nichoId ?? null,
      },
    });
  }

  /**
   * Lista influenciadores com filtros, paginação e perfis sociais relacionados.
   */
  async listar(
    params: ListarInfluenciadoresParams,
  ): Promise<ResultadoPaginado<InfluenciadorComRelacoes>> {
    const { busca, nicho, plataforma, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.InfluenciadorWhereInput = {
      ...(busca
        ? {
            OR: [
              { nome: { contains: busca } },
              { descricao: { contains: busca } },
            ],
          }
        : {}),
      ...(nicho
        ? {
            nicho: {
              slug: nicho,
            },
          }
        : {}),
      ...(plataforma
        ? {
            perfisSociais: {
              some: {
                plataforma,
              },
            },
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.influenciador.findMany({
        where,
        skip,
        take: limit,
        include: {
          nicho: true,
          perfisSociais: plataforma ? { where: { plataforma } } : true,
        },
        orderBy: {
          atualizadoEm: 'desc',
        },
      }),
      this.prisma.influenciador.count({ where }),
    ]);

    return { data, total };
  }
}
