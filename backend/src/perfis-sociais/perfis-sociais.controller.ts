import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListarPerfisSociaisDto } from './dto/listar-perfis-sociais.dto';
import type { PerfilSocialResponse } from './mappers/perfil-social.mapper';
import {
  PerfisSociaisService,
  type PerfisSociaisPaginadosResponse,
} from './perfis-sociais.service';

@Controller('perfis-sociais')
@ApiTags('Perfis Sociais')
export class PerfisSociaisController {
  constructor(private readonly perfisSociaisService: PerfisSociaisService) {}

  /**
   * Retorna uma lista paginada de perfis sociais.
   */
  @Get()
  listar(
    @Query() filtros: ListarPerfisSociaisDto,
  ): Promise<PerfisSociaisPaginadosResponse> {
    return this.perfisSociaisService.listar(filtros);
  }

  /**
   * Retorna os dados de um perfil social específico pelo ID.
   */
  @Get(':id')
  buscarPorId(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PerfilSocialResponse> {
    return this.perfisSociaisService.buscarPorId(id);
  }
}
