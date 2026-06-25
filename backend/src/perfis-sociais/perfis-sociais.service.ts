import { Injectable, NotFoundException } from '@nestjs/common';
import { Plataforma, Prisma } from '@prisma/client';
import { ListarPerfisSociaisDto } from './dto/listar-perfis-sociais.dto';
import {
  PerfilSocialMapper,
  type PerfilSocialResponse,
} from './mappers/perfil-social.mapper';
import { PerfisSociaisRepository } from './perfis-sociais.repository';

export interface PerfisSociaisPaginadosResponse {
  data: PerfilSocialResponse[];
  total: number;
  page: number;
  lastPage: number;
}

@Injectable()
export class PerfisSociaisService {
  constructor(
    private readonly perfisSociaisRepository: PerfisSociaisRepository,
  ) {}

  /**
   * Lista perfis sociais com paginação e filtros opcionais.
   */
  async listar(
    filtros: ListarPerfisSociaisDto,
  ): Promise<PerfisSociaisPaginadosResponse> {
    const page = filtros.page ?? 1;
    const limit = filtros.limit ?? 10;

    const result = await this.perfisSociaisRepository.listar({
      plataforma: filtros.plataforma,
      busca: filtros.busca,
      page,
      limit,
    });

    return {
      data: result.data.map((perfil) =>
        PerfilSocialMapper.paraResposta(perfil),
      ),
      total: result.total,
      page,
      lastPage: Math.ceil(result.total / limit),
    };
  }

  /**
   * Busca um perfil social pelo ID e retorna erro quando não existir.
   */
  async buscarPorId(id: string): Promise<PerfilSocialResponse> {
    const perfil = await this.perfisSociaisRepository.buscarPorId(id);

    if (!perfil) {
      throw new NotFoundException('Perfil social não encontrado.');
    }

    return PerfilSocialMapper.paraResposta(perfil);
  }

  /**
   * Cria ou atualiza um perfil social usando plataforma e identificador externo.
   */
  upsertPorIdentificador(params: {
    plataforma: Plataforma;
    identificadorExterno: string;
    dataCreate: Prisma.PerfilSocialCreateInput;
    dataUpdate: Prisma.PerfilSocialUpdateInput;
  }) {
    return this.perfisSociaisRepository.upsertPorIdentificador(params);
  }
}
