import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FiltroRankingConteudosDto } from './dto/filtro-ranking-conteudos.dto';
import { FiltroRankingInfluenciadoresDto } from './dto/filtro-ranking-influenciadores.dto';
import {
  RankingsService,
  type RankingConteudosResponse,
  type RankingInfluenciadoresResponse,
} from './rankings.service';

@Controller('rankings')
@ApiTags('Rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  /**
   * Retorna o ranking de conteúdos conforme os filtros enviados na query.
   */
  @Get('conteudos')
  listarConteudos(
    @Query() filtros: FiltroRankingConteudosDto,
  ): Promise<RankingConteudosResponse> {
    return this.rankingsService.listarConteudos(filtros);
  }

  /**
   * Retorna o ranking de influenciadores conforme os filtros enviados na query.
   */
  @Get('influenciadores')
  listarInfluenciadores(
    @Query() filtros: FiltroRankingInfluenciadoresDto,
  ): Promise<RankingInfluenciadoresResponse> {
    return this.rankingsService.listarInfluenciadores(filtros);
  }
}
