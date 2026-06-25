import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  YoutubeCanalItem,
  YoutubeChannelsResponse,
} from './interfaces/youtube-canal.interface';
import { YoutubeSearchResponse } from './interfaces/youtube-search.interface';
import {
  YoutubeVideoItem,
  YoutubeVideosResponse,
} from './interfaces/youtube-video.interface';

interface YoutubeErroResponse {
  error?: {
    message?: string;
    errors?: Array<{
      reason?: string;
    }>;
  };
}

@Injectable()
export class YoutubeClient {
  private readonly logger = new Logger(YoutubeClient.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('YOUTUBE_API_BASE_URL') ??
      'https://www.googleapis.com/youtube/v3';
  }

  /**
   * Pesquisa vídeos por nicho e retorna somente os IDs encontrados.
   */
  async buscarVideosPorNicho(
    nicho: string,
    quantidadeResultados: number,
  ): Promise<string[]> {
    const apiKey = this.obterApiKey();

    try {
      const response = await firstValueFrom(
        this.httpService.get<YoutubeSearchResponse>(`${this.baseUrl}/search`, {
          params: {
            key: apiKey,
            part: 'snippet',
            q: nicho,
            type: 'video',
            order: 'viewCount',
            maxResults: quantidadeResultados,
            regionCode:
              this.configService.get<string>('YOUTUBE_REGION_CODE') ?? 'BR',
            relevanceLanguage:
              this.configService.get<string>('YOUTUBE_RELEVANCE_LANGUAGE') ??
              'pt',
            safeSearch: 'moderate',
          },
        }),
      );

      const videoIds =
        response.data.items
          ?.map((item) => item.id?.videoId)
          .filter((videoId): videoId is string => Boolean(videoId)) ?? [];

      this.logger.log(
        `YouTube search retornou ${videoIds.length} vídeos para o nicho: ${nicho}`,
      );

      return [...new Set(videoIds)];
    } catch (error) {
      this.tratarErroYoutube(error, 'buscar vídeos por nicho');
    }
  }

  /**
   * Busca estatísticas, snippet e duração dos vídeos encontrados.
   */
  async buscarDetalhesDosVideos(
    videoIds: string[],
  ): Promise<YoutubeVideoItem[]> {
    if (videoIds.length === 0) return [];

    const apiKey = this.obterApiKey();

    try {
      const response = await firstValueFrom(
        this.httpService.get<YoutubeVideosResponse>(`${this.baseUrl}/videos`, {
          params: {
            key: apiKey,
            part: 'snippet,statistics,contentDetails',
            id: videoIds.join(','),
          },
        }),
      );

      return response.data.items ?? [];
    } catch (error) {
      this.tratarErroYoutube(error, 'buscar detalhes dos vídeos');
    }
  }

  /**
   * Busca estatísticas e metadados dos canais relacionados aos vídeos.
   */
  async buscarDetalhesDosCanais(
    channelIds: string[],
  ): Promise<YoutubeCanalItem[]> {
    const idsUnicos = [...new Set(channelIds)].filter(Boolean);

    if (idsUnicos.length === 0) return [];

    const apiKey = this.obterApiKey();

    try {
      const response = await firstValueFrom(
        this.httpService.get<YoutubeChannelsResponse>(
          `${this.baseUrl}/channels`,
          {
            params: {
              key: apiKey,
              part: 'snippet,statistics',
              id: idsUnicos.join(','),
            },
          },
        ),
      );

      return response.data.items ?? [];
    } catch (error) {
      this.tratarErroYoutube(error, 'buscar detalhes dos canais');
    }
  }

  /**
   * Recupera a chave da API ou interrompe a operação se ela não estiver configurada.
   */
  private obterApiKey(): string {
    const apiKey = this.configService.get<string>('YOUTUBE_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException(
        'YOUTUBE_API_KEY não está configurada no ambiente.',
      );
    }

    return apiKey;
  }

  /**
   * Converte erros da YouTube Data API em exceções HTTP compreensíveis.
   */
  private tratarErroYoutube(error: unknown, operacao: string): never {
    const ehErroAxios = isAxiosError<YoutubeErroResponse>(error);

    const status = ehErroAxios ? error.response?.status : undefined;
    const reason = ehErroAxios
      ? error.response?.data?.error?.errors?.[0]?.reason
      : undefined;

    const message = ehErroAxios
      ? (error.response?.data?.error?.message ??
        error.message ??
        'Erro desconhecido ao consultar a YouTube Data API.')
      : 'Erro desconhecido ao consultar a YouTube Data API.';

    this.logger.error(`Erro ao ${operacao}: ${message}`);

    if (status === 400) {
      throw new BadRequestException(
        `Parâmetros inválidos ao ${operacao} no YouTube.`,
      );
    }

    if (
      status === 403 &&
      ['quotaExceeded', 'dailyLimitExceeded'].includes(reason ?? '')
    ) {
      throw new ServiceUnavailableException(
        'Quota da YouTube Data API excedida. Tente novamente mais tarde ou use os dados já salvos no banco.',
      );
    }

    if (status === 403) {
      throw new ServiceUnavailableException(
        'Acesso negado pela YouTube Data API. Verifique a chave da API e as permissões.',
      );
    }

    throw new BadGatewayException('Falha ao consultar a YouTube Data API.');
  }
}
