import { Injectable } from '@nestjs/common';
import { Plataforma, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import type { PerfilSocialComRelacoes } from './mappers/perfil-social.mapper';

interface ListarPerfisSociaisParams {
  plataforma?: Plataforma;
  busca?: string;
  page: number;
  limit: number;
}

interface ResultadoPaginado<T> {
  data: T[];
  total: number;
}

@Injectable()
export class PerfisSociaisRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca um perfil social pelo ID incluindo influenciador e nicho.
   */
  buscarPorId(id: string): Promise<PerfilSocialComRelacoes | null> {
    return this.prisma.perfilSocial.findUnique({
      where: { id },
      include: {
        influenciador: {
          include: { nicho: true },
        },
      },
    });
  }

  /**
   * Busca um perfil social pela chave única de plataforma e identificador externo.
   */
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

  /**
   * Cria ou atualiza um perfil social pela chave única de plataforma e identificador externo.
   */
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

  /**
   * Lista perfis sociais com filtros, paginação e ordenação por seguidores.
   */
  async listar(
    params: ListarPerfisSociaisParams,
  ): Promise<ResultadoPaginado<PerfilSocialComRelacoes>> {
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
