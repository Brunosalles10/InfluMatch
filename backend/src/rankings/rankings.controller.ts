import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FiltroRankingConteudosDto } from './dto/filtro-ranking-conteudos.dto';
import { FiltroRankingInfluenciadoresDto } from './dto/filtro-ranking-influenciadores.dto';
import { RankingsService } from './rankings.service';

@Controller('rankings')
@ApiTags('Rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get('conteudos')
  listarConteudos(@Query() filtros: FiltroRankingConteudosDto) {
    return this.rankingsService.listarConteudos(filtros);
  }

  @Get('influenciadores')
  listarInfluenciadores(@Query() filtros: FiltroRankingInfluenciadoresDto) {
    return this.rankingsService.listarInfluenciadores(filtros);
  }
}
