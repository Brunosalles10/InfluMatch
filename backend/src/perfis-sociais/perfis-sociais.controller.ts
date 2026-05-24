import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListarPerfisSociaisDto } from './dto/listar-perfis-sociais.dto';
import { PerfisSociaisService } from './perfis-sociais.service';

@Controller('perfis-sociais')
@ApiTags('Perfis Sociais')
export class PerfisSociaisController {
  constructor(private readonly perfisSociaisService: PerfisSociaisService) {}

  @Get()
  listar(@Query() filtros: ListarPerfisSociaisDto) {
    return this.perfisSociaisService.listar(filtros);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.perfisSociaisService.buscarPorId(id);
  }
}
