import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NichosRepository {
  constructor(private readonly prisma: PrismaService) {}

  criar(data: Prisma.NichoCreateInput) {
    return this.prisma.nicho.create({ data });
  }

  listar(busca?: string) {
    return this.prisma.nicho.findMany({
      where: busca
        ? {
            OR: [{ nome: { contains: busca } }, { slug: { contains: busca } }],
          }
        : undefined,
      orderBy: { nome: 'asc' },
    });
  }

  buscarPorId(id: string) {
    return this.prisma.nicho.findUnique({ where: { id } });
  }

  buscarPorSlug(slug: string) {
    return this.prisma.nicho.findUnique({ where: { slug } });
  }

  buscarPorNome(nome: string) {
    return this.prisma.nicho.findUnique({ where: { nome } });
  }
}
