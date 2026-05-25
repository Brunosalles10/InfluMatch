import { Injectable } from '@nestjs/common';
import { Plataforma, TipoConteudo } from '@prisma/client';
import { DadosConteudoSocial } from 'src/integracoes/interfaces/dados-conteudo-social.interface';
import { DadosPerfilSocial } from 'src/integracoes/interfaces/dados-perfil-social.interface';
import { YoutubeCanalItem } from '../interfaces/youtube-canal.interface';
import { YoutubeVideoItem } from '../interfaces/youtube-video.interface';

@Injectable()
export class YoutubeMapper {
  mapearCanalParaPerfilSocial(canal: YoutubeCanalItem): DadosPerfilSocial {
    const titulo = canal.snippet?.title?.trim() || 'Canal sem nome';

    return {
      plataforma: Plataforma.YOUTUBE,
      identificadorExterno: canal.id,
      nome: titulo,
      nomeUsuario: titulo,
      descricao: canal.snippet?.description ?? null,
      imagemUrl: this.obterMelhorThumbnail(canal.snippet?.thumbnails),
      urlPerfil: `https://www.youtube.com/channel/${canal.id}`,
      totalSeguidores: this.paraBigInt(canal.statistics?.subscriberCount),
      totalVisualizacoes: this.paraBigInt(canal.statistics?.viewCount),
      totalConteudos: this.paraNumero(canal.statistics?.videoCount),
    };
  }

  mapearVideoParaConteudo(video: YoutubeVideoItem): DadosConteudoSocial {
    const totalViews = this.paraBigInt(video.statistics?.viewCount);
    const totalLikes = this.paraBigInt(video.statistics?.likeCount);
    const totalComentarios = this.paraBigInt(video.statistics?.commentCount);

    return {
      plataforma: Plataforma.YOUTUBE,
      tipoConteudo: this.identificarTipoConteudo(video.contentDetails?.duration),
      identificadorExterno: video.id,
      titulo: video.snippet?.title?.trim() || 'Vídeo sem título',
      descricao: video.snippet?.description ?? null,
      urlConteudo: `https://www.youtube.com/watch?v=${video.id}`,
      urlThumbnail: this.obterMelhorThumbnail(video.snippet?.thumbnails),
      totalViews,
      totalLikes,
      totalComentarios,
      taxaEngajamento: this.calcularTaxaEngajamento(
        totalLikes,
        totalComentarios,
        totalViews,
      ),
      publicadoEm: video.snippet?.publishedAt ? new Date(video.snippet.publishedAt) : null,
    };
  }

  extrairChannelIdDoVideo(video: YoutubeVideoItem): string | null {
    return video.snippet?.channelId ?? null;
  }

  private identificarTipoConteudo(duracaoIso?: string): TipoConteudo {
    const duracaoEmSegundos = this.converterDuracaoIsoParaSegundos(duracaoIso);

    if (duracaoEmSegundos > 0 && duracaoEmSegundos <= 60) {
      return TipoConteudo.SHORT;
    }

    return TipoConteudo.VIDEO;
  }

  private converterDuracaoIsoParaSegundos(duracaoIso?: string): number {
    if (!duracaoIso) return 0;

    const match = duracaoIso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const horas = Number(match[1] ?? 0);
    const minutos = Number(match[2] ?? 0);
    const segundos = Number(match[3] ?? 0);

    return horas * 3600 + minutos * 60 + segundos;
  }

  private calcularTaxaEngajamento(
    totalLikes: bigint,
    totalComentarios: bigint,
    totalViews: bigint,
  ): number {
    if (totalViews <= 0n) return 0;

    const engajamento = Number(totalLikes + totalComentarios);
    const visualizacoes = Number(totalViews);

    return Number(((engajamento / visualizacoes) * 100).toFixed(2));
  }

  private obterMelhorThumbnail(thumbnails?: any): string | null {
    return (
      thumbnails?.maxres?.url ??
      thumbnails?.standard?.url ??
      thumbnails?.high?.url ??
      thumbnails?.medium?.url ??
      thumbnails?.default?.url ??
      null
    );
  }

  private paraBigInt(valor?: string): bigint {
    if (!valor) return 0n;
    return BigInt(valor);
  }

  private paraNumero(valor?: string): number {
    if (!valor) return 0;
    return Number(valor);
  }
}
