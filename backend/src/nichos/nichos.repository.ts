import { Injectable } from '@nestjs/common';
import { type Nicho, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NichosRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Persiste um novo nicho no banco de dados.
   */
  criar(data: Prisma.NichoCreateInput): Promise<Nicho> {
    return this.prisma.nicho.create({ data });
  }

  /**
   * Lista nichos em ordem alfabética, filtrando por nome ou slug quando houver busca.
   */
  listar(busca?: string): Promise<Nicho[]> {
    return this.prisma.nicho.findMany({
      where: busca
        ? {
            OR: [{ nome: { contains: busca } }, { slug: { contains: busca } }],
          }
        : undefined,
      orderBy: { nome: 'asc' },
    });
  }

  /**
   * Busca um nicho pela chave primária.
   */
  buscarPorId(id: string): Promise<Nicho | null> {
    return this.prisma.nicho.findUnique({ where: { id } });
  }

  /**
   * Busca um nicho pelo slug único.
   */
  buscarPorSlug(slug: string): Promise<Nicho | null> {
    return this.prisma.nicho.findUnique({ where: { slug } });
  }
}
