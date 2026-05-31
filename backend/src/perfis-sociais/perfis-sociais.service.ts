import { Injectable, NotFoundException } from '@nestjs/common';
import { Plataforma, Prisma } from '@prisma/client';
import { ListarPerfisSociaisDto } from './dto/listar-perfis-sociais.dto';
import { PerfilSocialMapper } from './mappers/perfil-social.mapper';
import { PerfisSociaisRepository } from './perfis-sociais.repository';

@Injectable()
export class PerfisSociaisService {
  constructor(
    private readonly perfisSociaisRepository: PerfisSociaisRepository,
  ) {}

  async listar(filtros: ListarPerfisSociaisDto) {
    const page = filtros.page ?? 1;
    const limit = filtros.limit ?? 10;

    const result = await this.perfisSociaisRepository.listar({
      plataforma: filtros.plataforma,
      busca: filtros.busca,
      page,
      limit,
    });

    return {
      data: result.data.map(PerfilSocialMapper.paraResposta),
      total: result.total,
      page,
      lastPage: Math.ceil(result.total / limit),
    };
  }

  async buscarPorId(id: string) {
    const perfil = await this.perfisSociaisRepository.buscarPorId(id);

    if (!perfil) {
      throw new NotFoundException('Perfil social não encontrado.');
    }

    return PerfilSocialMapper.paraResposta(perfil);
  }

  upsertPorIdentificador(params: {
    plataforma: Plataforma;
    identificadorExterno: string;
    dataCreate: Prisma.PerfilSocialCreateInput;
    dataUpdate: Prisma.PerfilSocialUpdateInput;
  }) {
    return this.perfisSociaisRepository.upsertPorIdentificador(params);
  }
}
