import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { InstagramApiErrorResponse } from './interfaces/instagram-api-error.interface';
import { InstagramHashtagSearchResponse } from './interfaces/instagram-hashtag.interface';
import {
  InstagramMidiaItem,
  InstagramMidiasResponse,
} from './interfaces/instagram-media.interface';

@Injectable()
export class InstagramClient {
  private readonly logger = new Logger(InstagramClient.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('INSTAGRAM_API_BASE_URL') ??
      'https://graph.facebook.com/v23.0';
  }

  async buscarHashtagId(hashtag: string): Promise<string | null> {
    const accessToken = this.obterAccessToken();
    const instagramUserId = this.obterInstagramUserId();

    try {
      const response = await firstValueFrom(
        this.httpService.get<InstagramHashtagSearchResponse>(
          `${this.baseUrl}/ig_hashtag_search`,
          {
            params: {
              user_id: instagramUserId,
              q: hashtag,
              access_token: accessToken,
            },
          },
        ),
      );

      const hashtagId = response.data.data?.[0]?.id ?? null;

      if (!hashtagId) {
        this.logger.warn(`Hashtag não encontrada no Instagram: #${hashtag}`);
      }

      return hashtagId;
    } catch (error) {
      this.tratarErroInstagram(error, `buscar hashtag #${hashtag}`);
    }
  }

  async buscarMidiasPopularesPorHashtag(
    hashtagId: string,
    quantidadeResultados: number,
  ): Promise<InstagramMidiaItem[]> {
    return this.buscarMidiasPorHashtag(
      hashtagId,
      quantidadeResultados,
      'top_media',
    );
  }

  async buscarMidiasRecentesPorHashtag(
    hashtagId: string,
    quantidadeResultados: number,
  ): Promise<InstagramMidiaItem[]> {
    return this.buscarMidiasPorHashtag(
      hashtagId,
      quantidadeResultados,
      'recent_media',
    );
  }

  private async buscarMidiasPorHashtag(
    hashtagId: string,
    quantidadeResultados: number,
    endpoint: 'top_media' | 'recent_media',
  ): Promise<InstagramMidiaItem[]> {
    const accessToken = this.obterAccessToken();
    const instagramUserId = this.obterInstagramUserId();

    try {
      const response = await firstValueFrom(
        this.httpService.get<InstagramMidiasResponse>(
          `${this.baseUrl}/${hashtagId}/${endpoint}`,
          {
            params: {
              user_id: instagramUserId,
              fields:
                'id,caption,media_type,media_product_type,permalink,media_url,thumbnail_url,timestamp,like_count,comments_count,username',
              limit: quantidadeResultados,
              access_token: accessToken,
            },
          },
        ),
      );

      const midias = response.data.data ?? [];

      this.logger.log(
        `Instagram ${endpoint} retornou ${midias.length} mídias para hashtag ID ${hashtagId}`,
      );

      return midias;
    } catch (error) {
      this.tratarErroInstagram(
        error,
        `buscar mídias ${endpoint} da hashtag ${hashtagId}`,
      );
    }
  }

  private obterAccessToken(): string {
    const accessToken = this.configService.get<string>('INSTAGRAM_ACCESS_TOKEN');

    if (!accessToken) {
      throw new InternalServerErrorException(
        'INSTAGRAM_ACCESS_TOKEN não está configurado no ambiente.',
      );
    }

    return accessToken;
  }

  private obterInstagramUserId(): string {
    const instagramUserId = this.configService.get<string>('INSTAGRAM_IG_USER_ID');

    if (!instagramUserId) {
      throw new InternalServerErrorException(
        'INSTAGRAM_IG_USER_ID não está configurado no ambiente.',
      );
    }

    return instagramUserId;
  }

  private tratarErroInstagram(error: unknown, operacao: string): never {
    const axiosError = error as AxiosError<InstagramApiErrorResponse>;

    const status = axiosError.response?.status;
    const metaError = axiosError.response?.data?.error;
    const message =
      metaError?.message ??
      axiosError.message ??
      'Erro desconhecido ao consultar a Instagram Graph API.';

    this.logger.error(
      `Erro ao ${operacao}: ${message} | code=${metaError?.code ?? 'N/A'} | trace=${metaError?.fbtrace_id ?? 'N/A'}`,
    );

    if (status === 400) {
      throw new BadRequestException(
        `Parâmetros inválidos ao ${operacao} no Instagram.`,
      );
    }

    if (status === 401) {
      throw new UnauthorizedException(
        'Token da Instagram Graph API inválido ou expirado.',
      );
    }

    if (status === 403) {
      throw new ForbiddenException(
        'Permissão insuficiente para consultar a Instagram Graph API.',
      );
    }

    if (status === 429) {
      throw new ServiceUnavailableException(
        'Limite de requisições da Instagram Graph API excedido. Tente novamente mais tarde.',
      );
    }

    throw new BadGatewayException('Falha ao consultar a Instagram Graph API.');
  }
}
