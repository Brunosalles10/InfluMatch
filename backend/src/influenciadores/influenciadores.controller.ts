import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListarInfluenciadoresDto } from './dto/listar-influenciadores.dto';
import {
  InfluenciadoresService,
  type InfluenciadoresPaginadosResponse,
} from './influenciadores.service';
import type { InfluenciadorResponse } from './mappers/influenciador.mapper';

@Controller('influenciadores')
@ApiTags('Influenciadores')
export class InfluenciadoresController {
  constructor(
    private readonly influenciadoresService: InfluenciadoresService,
  ) {}

  /**
   * Retorna uma lista paginada de influenciadores.
   */
  @Get()
  listar(
    @Query() filtros: ListarInfluenciadoresDto,
  ): Promise<InfluenciadoresPaginadosResponse> {
    return this.influenciadoresService.listar(filtros);
  }

  /**
   * Retorna os dados de um influenciador específico pelo ID.
   */
  @Get(':id')
  buscarPorId(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<InfluenciadorResponse> {
    return this.influenciadoresService.buscarPorId(id);
  }
}
