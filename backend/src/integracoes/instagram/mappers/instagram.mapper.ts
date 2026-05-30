import { Injectable } from '@nestjs/common';
import { Plataforma, TipoConteudo } from '@prisma/client';
import { DadosConteudoSocial } from 'src/integracoes/interfaces/dados-conteudo-social.interface';
import { DadosPerfilSocial } from 'src/integracoes/interfaces/dados-perfil-social.interface';
import { InstagramMidiaItem } from '../interfaces/instagram-media.interface';

@Injectable()
export class InstagramMapper {
  mapearMidiaParaPerfilSocial(midia: InstagramMidiaItem): DadosPerfilSocial {
    const nomeUsuario = this.obterNomeUsuario(midia);

    return {
      plataforma: Plataforma.INSTAGRAM,
      identificadorExterno: nomeUsuario,
      nome: nomeUsuario,
      nomeUsuario,
      descricao: null,
      imagemUrl: null,
      urlPerfil: `https://www.instagram.com/${nomeUsuario}`,
      totalSeguidores: 0n,
      totalVisualizacoes: 0n,
      totalConteudos: 0,
    };
  }

  mapearMidiaParaConteudo(midia: InstagramMidiaItem): DadosConteudoSocial {
    const totalLikes = BigInt(midia.like_count ?? 0);
    const totalComentarios = BigInt(midia.comments_count ?? 0);
    const totalViews = 0n;

    return {
      plataforma: Plataforma.INSTAGRAM,
      tipoConteudo: this.identificarTipoConteudo(midia),
      identificadorExterno: midia.id,
      titulo: this.gerarTitulo(midia),
      descricao: midia.caption ?? null,
      urlConteudo: midia.permalink ?? null,
      urlThumbnail: midia.thumbnail_url ?? midia.media_url ?? null,
      totalViews,
      totalLikes,
      totalComentarios,
      taxaEngajamento: this.calcularScoreEngajamento(totalLikes, totalComentarios),
      publicadoEm: midia.timestamp ? new Date(midia.timestamp) : null,
    };
  }

  private identificarTipoConteudo(midia: InstagramMidiaItem): TipoConteudo {
    if (midia.media_product_type === 'REELS') {
      return TipoConteudo.REEL;
    }

    return TipoConteudo.POST;
  }

  private gerarTitulo(midia: InstagramMidiaItem): string {
    const caption = midia.caption?.trim();

    if (!caption) {
      return `Conteúdo do Instagram ${midia.id}`;
    }

    return caption.length > 120 ? `${caption.slice(0, 117)}...` : caption;
  }

  private obterNomeUsuario(midia: InstagramMidiaItem): string {
    const username = midia.username?.trim();

    if (username) {
      return username;
    }

    return `instagram_${midia.id}`;
  }

  private calcularScoreEngajamento(
    totalLikes: bigint,
    totalComentarios: bigint,
  ): number {
    return Number(totalLikes + totalComentarios);
  }
}
