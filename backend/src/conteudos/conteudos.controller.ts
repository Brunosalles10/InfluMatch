import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConteudosService } from './conteudos.service';
import { ListarConteudosDto } from './dto/listar-conteudos.dto';

@Controller('conteudos')
@ApiTags('Conteúdos')
export class ConteudosController {
  constructor(private readonly conteudosService: ConteudosService) {}

  @Get()
  listar(@Query() filtros: ListarConteudosDto) {
    return this.conteudosService.listar(filtros);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.conteudosService.buscarPorId(id);
  }
}
