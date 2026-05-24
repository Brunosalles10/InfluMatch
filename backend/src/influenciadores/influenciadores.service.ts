import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ListarInfluenciadoresDto } from './dto/listar-influenciadores.dto';
import { InfluenciadoresRepository } from './influenciadores.repository';
import { InfluenciadorMapper } from './mappers/influenciador.mapper';

@Injectable()
export class InfluenciadoresService {
  private readonly logger = new Logger(InfluenciadoresService.name);

  constructor(
    private readonly influenciadoresRepository: InfluenciadoresRepository,
  ) {}

  async listar(filtros: ListarInfluenciadoresDto) {
    const page = filtros.page ?? 1;
    const limit = filtros.limit ?? 10;

    const result = await this.influenciadoresRepository.listar({
      busca: filtros.busca,
      nicho: filtros.nicho,
      plataforma: filtros.plataforma,
      page,
      limit,
    });

    return {
      data: result.data.map(InfluenciadorMapper.paraResposta),
      total: result.total,
      page,
      lastPage: Math.ceil(result.total / limit),
    };
  }

  async buscarPorId(id: string) {
    const influenciador = await this.influenciadoresRepository.buscarPorId(id);

    if (!influenciador) {
      throw new NotFoundException('Influenciador não encontrado.');
    }

    return InfluenciadorMapper.paraResposta(influenciador);
  }

  async buscarOuCriar(data: {
    nome: string;
    descricao?: string | null;
    imagemUrl?: string | null;
    nichoId?: string | null;
  }) {
    const influenciadorExistente =
      await this.influenciadoresRepository.buscarPorNomeENicho(
        data.nome,
        data.nichoId,
      );

    if (influenciadorExistente) {
      return this.influenciadoresRepository.atualizar(
        influenciadorExistente.id,
        {
          descricao: data.descricao ?? influenciadorExistente.descricao,
          imagemUrl: data.imagemUrl ?? influenciadorExistente.imagemUrl,
        },
      );
    }

    this.logger.log(`Criando influenciador: ${data.nome}`);

    const createData: Prisma.InfluenciadorCreateInput = {
      nome: data.nome,
      descricao: data.descricao,
      imagemUrl: data.imagemUrl,
      ...(data.nichoId
        ? {
            nicho: {
              connect: { id: data.nichoId },
            },
          }
        : {}),
    };

    return this.influenciadoresRepository.criar(createData);
  }
}
