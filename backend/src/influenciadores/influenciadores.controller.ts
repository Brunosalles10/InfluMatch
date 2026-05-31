import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListarInfluenciadoresDto } from './dto/listar-influenciadores.dto';
import { InfluenciadoresService } from './influenciadores.service';

@Controller('influenciadores')
@ApiTags('Influenciadores')
export class InfluenciadoresController {
  constructor(
    private readonly influenciadoresService: InfluenciadoresService,
  ) {}

  @Get()
  listar(@Query() filtros: ListarInfluenciadoresDto) {
    return this.influenciadoresService.listar(filtros);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.influenciadoresService.buscarPorId(id);
  }
}
