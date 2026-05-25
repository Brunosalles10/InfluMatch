import { Injectable } from '@nestjs/common';
import { Plataforma, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface ListarPerfisSociaisParams {
  plataforma?: Plataforma;
  busca?: string;
  page: number;
  limit: number;
}

@Injectable()
export class PerfisSociaisRepository {
  constructor(private readonly prisma: PrismaService) {}

  buscarPorId(id: string) {
    return this.prisma.perfilSocial.findUnique({
      where: { id },
      include: {
        influenciador: {
          include: { nicho: true },
        },
      },
    });
  }

  buscarPorIdentificador(plataforma: Plataforma, identificadorExterno: string) {
    return this.prisma.perfilSocial.findUnique({
      where: {
        plataforma_identificadorExterno: {
          plataforma,
          identificadorExterno,
        },
      },
    });
  }

  upsertPorIdentificador(params: {
    plataforma: Plataforma;
    identificadorExterno: string;
    dataCreate: Prisma.PerfilSocialCreateInput;
    dataUpdate: Prisma.PerfilSocialUpdateInput;
  }) {
    return this.prisma.perfilSocial.upsert({
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

  async listar(params: ListarPerfisSociaisParams) {
    const { plataforma, busca, page, limit } = params;
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
        orderBy: { totalSeguidores: 'desc' },
      }),
      this.prisma.perfilSocial.count({ where }),
    ]);

    return { data, total };
  }
}
