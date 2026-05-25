import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Plataforma } from '@prisma/client';
import { gerarSlug } from 'src/common/utils/slug.util';
import { ConteudosService } from 'src/conteudos/conteudos.service';
import { InfluenciadoresService } from 'src/influenciadores/influenciadores.service';
import { NichosService } from 'src/nichos/nichos.service';
import { PerfisSociaisService } from 'src/perfis-sociais/perfis-sociais.service';
import { CacheService } from 'src/redis/cache.service';
import { ColetarYoutubeDto } from './dto/coletar-youtube.dto';
import { ResumoColetaYoutubeDto } from './dto/resumo-coleta-youtube.dto';
import { YoutubeCanalItem } from './interfaces/youtube-canal.interface';
import { YoutubeVideoItem } from './interfaces/youtube-video.interface';
import { YoutubeMapper } from './mappers/youtube.mapper';
import { YoutubeClient } from './youtube.client';

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);

  constructor(
    private readonly youtubeClient: YoutubeClient,
    private readonly youtubeMapper: YoutubeMapper,
    private readonly nichosService: NichosService,
    private readonly influenciadoresService: InfluenciadoresService,
    private readonly perfisSociaisService: PerfisSociaisService,
    private readonly conteudosService: ConteudosService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}

  async coletarPorNicho(
    dto: ColetarYoutubeDto,
  ): Promise<ResumoColetaYoutubeDto> {
    const quantidadeResultados = dto.quantidadeResultados ?? 10;
    const slugNicho = gerarSlug(dto.nicho);
    const cacheKey = `youtube:coleta:nicho:${slugNicho}:qtd:${quantidadeResultados}`;

    const cache = await this.cacheService.get<ResumoColetaYoutubeDto>(cacheKey);
    if (cache) {
      return {
        ...cache,
        retornadoDoCache: true,
      };
    }

    this.logger.log(
      `Iniciando coleta do YouTube para nicho "${dto.nicho}" com ${quantidadeResultados} resultados.`,
    );

    const nicho = await this.nichosService.buscarOuCriarPorNome(dto.nicho);

    const videoIds = await this.youtubeClient.buscarVideosPorNicho(
      dto.nicho,
      quantidadeResultados,
    );

    const videos = await this.youtubeClient.buscarDetalhesDosVideos(videoIds);

    const channelIds = videos
      .map((video) => this.youtubeMapper.extrairChannelIdDoVideo(video))
      .filter((channelId): channelId is string => Boolean(channelId));

    const canais = await this.youtubeClient.buscarDetalhesDosCanais(channelIds);
    const canaisPorId = new Map(canais.map((canal) => [canal.id, canal]));
    const perfisPorCanalId = new Map<string, { id: string }>();

    for (const canal of canais) {
      const perfil = await this.salvarCanal(canal, nicho.id);
      perfisPorCanalId.set(canal.id, { id: perfil.id });
    }

    let totalConteudosProcessados = 0;

    for (const video of videos) {
      const channelId = this.youtubeMapper.extrairChannelIdDoVideo(video);
      if (!channelId) continue;

      const canal = canaisPorId.get(channelId);
      if (!canal) continue;

      const perfil = perfisPorCanalId.get(channelId);
      if (!perfil) continue;

      await this.salvarVideo(video, perfil.id);
      totalConteudosProcessados += 1;
    }

    await this.cacheService.deleteByPrefix('rankings:*');

    const response: ResumoColetaYoutubeDto = {
      mensagem: 'Coleta do YouTube realizada com sucesso.',
      plataforma: Plataforma.YOUTUBE,
      nicho: {
        id: nicho.id,
        nome: nicho.nome,
        slug: nicho.slug,
      },
      totalVideosEncontrados: videos.length,
      totalCanaisProcessados: canais.length,
      totalConteudosProcessados,
      retornadoDoCache: false,
      atualizadoEm: new Date().toISOString(),
    };

    await this.cacheService.set(
      cacheKey,
      response,
      this.obterTtlCacheYoutube(),
    );

    return response;
  }

  private async salvarCanal(canal: YoutubeCanalItem, nichoId: string) {
    const dadosPerfil = this.youtubeMapper.mapearCanalParaPerfilSocial(canal);

    const influenciador = await this.influenciadoresService.buscarOuCriar({
      nome: dadosPerfil.nome,
      descricao: dadosPerfil.descricao,
      imagemUrl: dadosPerfil.imagemUrl,
      nichoId,
    });

    return this.perfisSociaisService.upsertPorIdentificador({
      plataforma: Plataforma.YOUTUBE,
      identificadorExterno: dadosPerfil.identificadorExterno,
      dataCreate: {
        plataforma: Plataforma.YOUTUBE,
        identificadorExterno: dadosPerfil.identificadorExterno,
        nomeUsuario: dadosPerfil.nomeUsuario,
        urlPerfil: dadosPerfil.urlPerfil,
        totalSeguidores: dadosPerfil.totalSeguidores,
        totalVisualizacoes: dadosPerfil.totalVisualizacoes,
        totalConteudos: dadosPerfil.totalConteudos,
        ultimaSincronizacaoEm: new Date(),
        influenciador: {
          connect: { id: influenciador.id },
        },
      },
      dataUpdate: {
        nomeUsuario: dadosPerfil.nomeUsuario,
        urlPerfil: dadosPerfil.urlPerfil,
        totalSeguidores: dadosPerfil.totalSeguidores,
        totalVisualizacoes: dadosPerfil.totalVisualizacoes,
        totalConteudos: dadosPerfil.totalConteudos,
        ultimaSincronizacaoEm: new Date(),
        influenciador: {
          connect: { id: influenciador.id },
        },
      },
    });
  }

  private async salvarVideo(video: YoutubeVideoItem, perfilSocialId: string) {
    const dadosConteudo = this.youtubeMapper.mapearVideoParaConteudo(video);

    return this.conteudosService.upsertPorIdentificador({
      plataforma: Plataforma.YOUTUBE,
      identificadorExterno: dadosConteudo.identificadorExterno,
      dataCreate: {
        plataforma: Plataforma.YOUTUBE,
        tipoConteudo: dadosConteudo.tipoConteudo,
        identificadorExterno: dadosConteudo.identificadorExterno,
        titulo: dadosConteudo.titulo,
        descricao: dadosConteudo.descricao,
        urlConteudo: dadosConteudo.urlConteudo,
        urlThumbnail: dadosConteudo.urlThumbnail,
        totalViews: dadosConteudo.totalViews,
        totalLikes: dadosConteudo.totalLikes,
        totalComentarios: dadosConteudo.totalComentarios,
        taxaEngajamento: dadosConteudo.taxaEngajamento,
        publicadoEm: dadosConteudo.publicadoEm,
        perfilSocial: {
          connect: { id: perfilSocialId },
        },
      },
      dataUpdate: {
        tipoConteudo: dadosConteudo.tipoConteudo,
        titulo: dadosConteudo.titulo,
        descricao: dadosConteudo.descricao,
        urlConteudo: dadosConteudo.urlConteudo,
        urlThumbnail: dadosConteudo.urlThumbnail,
        totalViews: dadosConteudo.totalViews,
        totalLikes: dadosConteudo.totalLikes,
        totalComentarios: dadosConteudo.totalComentarios,
        taxaEngajamento: dadosConteudo.taxaEngajamento,
        publicadoEm: dadosConteudo.publicadoEm,
        perfilSocial: {
          connect: { id: perfilSocialId },
        },
      },
    });
  }

  private obterTtlCacheYoutube(): number {
    const ttl = Number(
      this.configService.get<string>('YOUTUBE_CACHE_TTL_SECONDS'),
    );
    return Number.isNaN(ttl) ? 3600 : ttl;
  }
}
