import { Injectable } from '@nestjs/common';
import { Plataforma, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface ListarInfluenciadoresParams {
  busca?: string;
  nicho?: string;
  plataforma?: Plataforma;
  page: number;
  limit: number;
}

@Injectable()
export class InfluenciadoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  criar(data: Prisma.InfluenciadorCreateInput) {
    return this.prisma.influenciador.create({ data });
  }

  atualizar(id: string, data: Prisma.InfluenciadorUpdateInput) {
    return this.prisma.influenciador.update({ where: { id }, data });
  }

  buscarPorId(id: string) {
    return this.prisma.influenciador.findUnique({
      where: { id },
      include: {
        nicho: true,
        perfisSociais: true,
      },
    });
  }

  buscarPorNomeENicho(nome: string, nichoId?: string | null) {
    return this.prisma.influenciador.findFirst({
      where: {
        nome,
        nichoId: nichoId ?? null,
      },
    });
  }

  async listar(params: ListarInfluenciadoresParams) {
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
        orderBy: { atualizadoEm: 'desc' },
      }),
      this.prisma.influenciador.count({ where }),
    ]);

    return { data, total };
  }
}
