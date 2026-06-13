import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from 'src/redis/cache.service';
import {
  FiltroRankingConteudosDto,
  OrdenacaoRankingConteudo,
} from './dto/filtro-ranking-conteudos.dto';
import {
  FiltroRankingInfluenciadoresDto,
  OrdenacaoRankingInfluenciador,
} from './dto/filtro-ranking-influenciadores.dto';
import { RankingConteudoMapper } from './mappers/ranking-conteudo.mapper';
import { RankingInfluenciadorMapper } from './mappers/ranking-influenciador.mapper';
import { RankingsRepository } from './rankings.repository';

@Injectable()
export class RankingsService {
  private readonly logger = new Logger(RankingsService.name);
  private readonly ttlRankingSegundos = 3000;

  constructor(
    private readonly rankingsRepository: RankingsRepository,
    private readonly cacheService: CacheService,
  ) {}

  async listarConteudos(filtros: FiltroRankingConteudosDto) {
    const page = filtros.page ?? 1;
    const limit = filtros.limit ?? 10;
    const ordenarPor = filtros.ordenarPor ?? OrdenacaoRankingConteudo.VIRAL;
    const cacheKey = this.montarCacheKey('conteudos', {
      ...filtros,
      page,
      limit,
      ordenarPor,
    });

    const cache = await this.cacheService.get<any>(cacheKey);
    if (cache) {
      this.logger.debug(`Ranking de conteúdos retornado do cache: ${cacheKey}`);
      return cache;
    }

    const result = await this.rankingsRepository.listarConteudos({
      plataforma: filtros.plataforma,
      tipoConteudo: filtros.tipoConteudo,
      nicho: filtros.nicho,
      busca: filtros.busca,
      ordenarPor,
      page,
      limit,
    });

    const totalPages = Math.ceil(result.total / limit);

    const response = {
      data: result.data.map((conteudo, index) =>
        RankingConteudoMapper.paraResposta(
          conteudo,
          this.calcularPosicao(page, limit, index),
        ),
      ),
      total: result.total,
      page,
      limit,
      totalPages,
      lastPage: totalPages,
    };

    await this.cacheService.set(cacheKey, response, this.ttlRankingSegundos);

    return response;
  }

  async listarInfluenciadores(filtros: FiltroRankingInfluenciadoresDto) {
    const page = filtros.page ?? 1;
    const limit = filtros.limit ?? 10;
    const ordenarPor =
      filtros.ordenarPor ?? OrdenacaoRankingInfluenciador.SEGUIDORES;
    const cacheKey = this.montarCacheKey('influenciadores', {
      ...filtros,
      page,
      limit,
      ordenarPor,
    });

    const cache = await this.cacheService.get<any>(cacheKey);
    if (cache) {
      this.logger.debug(
        `Ranking de influenciadores retornado do cache: ${cacheKey}`,
      );
      return cache;
    }

    const result = await this.rankingsRepository.listarInfluenciadores({
      plataforma: filtros.plataforma,
      nicho: filtros.nicho,
      busca: filtros.busca,
      ordenarPor,
      page,
      limit,
    });

    const mediasEngajamento =
      await this.rankingsRepository.buscarMediasEngajamentoPorPerfis(
        result.data.map((perfil) => perfil.id),
      );

    const data = result.data.map((perfil, index) =>
      RankingInfluenciadorMapper.paraResposta(
        perfil,
        this.calcularPosicao(page, limit, index),
        mediasEngajamento.get(perfil.id) ?? 0,
      ),
    );

    if (ordenarPor === OrdenacaoRankingInfluenciador.ENGAJAMENTO) {
      data.sort((a, b) => b.mediaEngajamento - a.mediaEngajamento);
      data.forEach((item, index) => {
        item.posicao = this.calcularPosicao(page, limit, index);
      });
    }

    const totalPages = Math.ceil(result.total / limit);

    const response = {
      data,
      total: result.total,
      page,
      limit,
      totalPages,
      lastPage: totalPages,
    };

    await this.cacheService.set(cacheKey, response, this.ttlRankingSegundos);

    return response;
  }

  private calcularPosicao(page: number, limit: number, index: number): number {
    return (page - 1) * limit + index + 1;
  }

  private montarCacheKey(
    tipo: string,
    filtros: Record<string, unknown>,
  ): string {
    const partes = Object.entries(filtros)
      .filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      )
      .map(([key, value]) => `${key}:${String(value)}`)
      .join(':');

    return `rankings:${tipo}:${partes || 'todos'}`;
  }
}
