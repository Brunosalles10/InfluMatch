import { Injectable } from '@nestjs/common';
import { Plataforma, Prisma, TipoConteudo } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdenacaoConteudo } from './dto/listar-conteudos.dto';

interface ListarConteudosParams {
  plataforma?: Plataforma;
  tipoConteudo?: TipoConteudo;
  nicho?: string;
  busca?: string;
  ordenarPor: OrdenacaoConteudo;
  page: number;
  limit: number;
}

@Injectable()
export class ConteudosRepository {
  constructor(private readonly prisma: PrismaService) {}

  buscarPorId(id: string) {
    return this.prisma.conteudo.findUnique({
      where: { id },
      include: {
        perfilSocial: {
          include: {
            influenciador: {
              include: { nicho: true },
            },
          },
        },
      },
    });
  }

  upsertPorIdentificador(params: {
    plataforma: Plataforma;
    identificadorExterno: string;
    dataCreate: Prisma.ConteudoCreateInput;
    dataUpdate: Prisma.ConteudoUpdateInput;
  }) {
    return this.prisma.conteudo.upsert({
      where: {
        plataforma_identificadorExterno: {
          plataforma: params.plataforma,
          identificadorExterno: params.identificadorExterno,
        },
      },
      create: params.dataCreate,
      update: params.dataUpdate,
    });
  }

  async listar(params: ListarConteudosParams) {
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

    const orderBy = this.montarOrdenacao(ordenarPor);

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
        orderBy,
      }),
      this.prisma.conteudo.count({ where }),
    ]);

    return { data, total };
  }

  private montarOrdenacao(
    ordenarPor: OrdenacaoConteudo,
  ): Prisma.ConteudoOrderByWithRelationInput[] {
    switch (ordenarPor) {
      case OrdenacaoConteudo.VIEWS:
        return [{ totalViews: 'desc' }, { taxaEngajamento: 'desc' }];
      case OrdenacaoConteudo.ENGAJAMENTO:
        return [{ taxaEngajamento: 'desc' }, { totalViews: 'desc' }];
      case OrdenacaoConteudo.RECENTE:
        return [{ publicadoEm: 'desc' }, { totalViews: 'desc' }];
      case OrdenacaoConteudo.VIRAL:
      default:
        return [
          { taxaEngajamento: 'desc' },
          { totalViews: 'desc' },
          { totalLikes: 'desc' },
          { totalComentarios: 'desc' },
        ];
    }
  }
}
