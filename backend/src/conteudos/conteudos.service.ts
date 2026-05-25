import { Injectable, NotFoundException } from '@nestjs/common';
import { Plataforma, Prisma } from '@prisma/client';
import { ConteudosRepository } from './conteudos.repository';
import {
  ListarConteudosDto,
  OrdenacaoConteudo,
} from './dto/listar-conteudos.dto';
import { ConteudoMapper } from './mappers/conteudo.mapper';

@Injectable()
export class ConteudosService {
  constructor(private readonly conteudosRepository: ConteudosRepository) {}

  async listar(filtros: ListarConteudosDto) {
    const page = filtros.page ?? 1;
    const limit = filtros.limit ?? 10;

    const result = await this.conteudosRepository.listar({
      plataforma: filtros.plataforma,
      tipoConteudo: filtros.tipoConteudo,
      nicho: filtros.nicho,
      busca: filtros.busca,
      ordenarPor: filtros.ordenarPor ?? OrdenacaoConteudo.VIRAL,
      page,
      limit,
    });

    return {
      data: result.data.map(ConteudoMapper.paraResposta),
      total: result.total,
      page,
      lastPage: Math.ceil(result.total / limit),
    };
  }

  async buscarPorId(id: string) {
    const conteudo = await this.conteudosRepository.buscarPorId(id);

    if (!conteudo) {
      throw new NotFoundException('Conteúdo não encontrado.');
    }

    return ConteudoMapper.paraResposta(conteudo);
  }

  upsertPorIdentificador(params: {
    plataforma: Plataforma;
    identificadorExterno: string;
    dataCreate: Prisma.ConteudoCreateInput;
    dataUpdate: Prisma.ConteudoUpdateInput;
  }) {
    return this.conteudosRepository.upsertPorIdentificador(params);
  }

  calcularTaxaEngajamento(
    totalLikes: number,
    totalComentarios: number,
    totalViews: number,
  ): number {
    if (totalViews <= 0) return 0;
    return Number(
      (((totalLikes + totalComentarios) / totalViews) * 100).toFixed(2),
    );
  }
}
