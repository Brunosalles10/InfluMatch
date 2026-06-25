import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { type Influenciador, Prisma } from '@prisma/client';
import { ListarInfluenciadoresDto } from './dto/listar-influenciadores.dto';
import { InfluenciadoresRepository } from './influenciadores.repository';
import {
  InfluenciadorMapper,
  type InfluenciadorResponse,
} from './mappers/influenciador.mapper';

export interface InfluenciadoresPaginadosResponse {
  data: InfluenciadorResponse[];
  total: number;
  page: number;
  lastPage: number;
}

interface BuscarOuCriarInfluenciadorParams {
  nome: string;
  descricao?: string | null;
  imagemUrl?: string | null;
  nichoId?: string | null;
}

@Injectable()
export class InfluenciadoresService {
  private readonly logger = new Logger(InfluenciadoresService.name);

  constructor(
    private readonly influenciadoresRepository: InfluenciadoresRepository,
  ) {}

  /**
   * Lista influenciadores com filtros opcionais e paginação.
   */
  async listar(
    filtros: ListarInfluenciadoresDto,
  ): Promise<InfluenciadoresPaginadosResponse> {
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
      data: result.data.map((influenciador) =>
        InfluenciadorMapper.paraResposta(influenciador),
      ),
      total: result.total,
      page,
      lastPage: Math.ceil(result.total / limit),
    };
  }

  /**
   * Busca um influenciador pelo ID e retorna erro quando ele não existir.
   */
  async buscarPorId(id: string): Promise<InfluenciadorResponse> {
    const influenciador = await this.influenciadoresRepository.buscarPorId(id);

    if (!influenciador) {
      throw new NotFoundException('Influenciador não encontrado.');
    }

    return InfluenciadorMapper.paraResposta(influenciador);
  }

  /**
   * Reutiliza um influenciador existente pelo nome e nicho ou cria um novo registro.
   */
  async buscarOuCriar(
    data: BuscarOuCriarInfluenciadorParams,
  ): Promise<Influenciador> {
    const nome = data.nome.trim();

    const influenciadorExistente =
      await this.influenciadoresRepository.buscarPorNomeENicho(
        nome,
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

    this.logger.log(`Criando influenciador: ${nome}`);

    const createData: Prisma.InfluenciadorCreateInput = {
      nome,
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
