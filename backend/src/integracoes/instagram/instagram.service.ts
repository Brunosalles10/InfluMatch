import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Plataforma } from '@prisma/client';
import { gerarSlug } from 'src/common/utils/slug.util';
import { ProvedorSocialPorTermo } from 'src/integracoes/interfaces/provedor-social-por-termo.interface';
import { CacheService } from 'src/redis/cache.service';
import { ColetarInstagramDto } from './dto/coletar-instagram.dto';
import { ResumoColetaInstagramDto } from './dto/resumo-coleta-instagram.dto';
import { InstagramMidiaItem } from './interfaces/instagram-media.interface';
import { InstagramMapper } from './mappers/instagram.mapper';
import { InstagramClient } from './instagram.client';
import { InstagramRepository } from './instagram.repository';

@Injectable()
export class InstagramService
  implements ProvedorSocialPorTermo<ColetarInstagramDto, ResumoColetaInstagramDto>
{
  private readonly logger = new Logger(InstagramService.name);

  constructor(
    private readonly instagramClient: InstagramClient,
    private readonly instagramMapper: InstagramMapper,
    private readonly instagramRepository: InstagramRepository,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}

  async coletarPorTermo(
    dto: ColetarInstagramDto,
  ): Promise<ResumoColetaInstagramDto> {
    const quantidadeResultados = dto.quantidadeResultados ?? 10;
    const termo = dto.termo.trim();
    const nomeNicho = dto.nicho?.trim() || termo;
    const cacheKey = this.montarCacheKey(termo, quantidadeResultados);

    const cache = await this.cacheService.get<ResumoColetaInstagramDto>(
      cacheKey,
    );

    if (cache) {
      return {
        ...cache,
        retornadoDoCache: true,
      };
    }

    this.logger.log(
      `Iniciando coleta do Instagram para termo "${termo}" com ${quantidadeResultados} resultados.`,
    );

    const nicho = await this.instagramRepository.buscarOuCriarNicho(nomeNicho);
    const hashtags = this.gerarHashtagsPorTermo(termo, nomeNicho);
    const midias = await this.buscarMidiasPorHashtags(
      hashtags,
      quantidadeResultados,
    );

    const totalConteudosProcessados = await this.salvarMidias(
      midias,
      nicho.id,
    );

    await this.cacheService.deleteByPrefix('rankings:*');

    const response: ResumoColetaInstagramDto = {
      mensagem: 'Coleta do Instagram realizada com sucesso.',
      plataforma: Plataforma.INSTAGRAM,
      termo,
      hashtagsUtilizadas: hashtags,
      nicho: {
        id: nicho.id,
        nome: nicho.nome,
        slug: nicho.slug,
      },
      totalHashtagsProcessadas: hashtags.length,
      totalMidiasEncontradas: midias.length,
      totalConteudosProcessados,
      retornadoDoCache: false,
      atualizadoEm: new Date().toISOString(),
    };

    await this.cacheService.set(
      cacheKey,
      response,
      this.obterTtlCacheInstagram(),
    );

    return response;
  }

  private async buscarMidiasPorHashtags(
    hashtags: string[],
    quantidadeResultados: number,
  ): Promise<InstagramMidiaItem[]> {
    const midiasPorId = new Map<string, InstagramMidiaItem>();

    for (const hashtag of hashtags) {
      const hashtagId = await this.instagramClient.buscarHashtagId(hashtag);

      if (!hashtagId) {
        continue;
      }

      const midiasPopulares =
        await this.instagramClient.buscarMidiasPopularesPorHashtag(
          hashtagId,
          quantidadeResultados,
        );

      const midiasRecentes =
        await this.instagramClient.buscarMidiasRecentesPorHashtag(
          hashtagId,
          quantidadeResultados,
        );

      [...midiasPopulares, ...midiasRecentes].forEach((midia) => {
        midiasPorId.set(midia.id, midia);
      });
    }

    return [...midiasPorId.values()].slice(0, quantidadeResultados);
  }

  private async salvarMidias(
    midias: InstagramMidiaItem[],
    nichoId: string,
  ): Promise<number> {
    let totalConteudosProcessados = 0;
    const perfisProcessados = new Set<string>();

    for (const midia of midias) {
      const dadosPerfil = this.instagramMapper.mapearMidiaParaPerfilSocial(midia);
      const dadosConteudo = this.instagramMapper.mapearMidiaParaConteudo(midia);

      const perfil = await this.instagramRepository.salvarPerfilSocial(
        dadosPerfil,
        nichoId,
      );

      await this.instagramRepository.salvarConteudo(dadosConteudo, perfil.id);
      perfisProcessados.add(perfil.id);
      totalConteudosProcessados += 1;
    }

    for (const perfilSocialId of perfisProcessados) {
      await this.instagramRepository.atualizarTotalConteudosDoPerfil(
        perfilSocialId,
      );
    }

    return totalConteudosProcessados;
  }

  private gerarHashtagsPorTermo(termo: string, nicho: string): string[] {
    const hashtagsBase = [
      this.normalizarHashtag(termo),
      this.normalizarHashtag(nicho),
      ...this.obterPalavrasDoTermo(termo),
      ...this.obterHashtagsRelacionadas(termo, nicho),
    ];

    return [...new Set(hashtagsBase)]
      .filter((hashtag) => hashtag.length >= 2 && hashtag.length <= 30)
      .slice(0, 5);
  }

  private obterPalavrasDoTermo(termo: string): string[] {
    return termo
      .split(/\s+/)
      .map((palavra) => this.normalizarHashtag(palavra))
      .filter(Boolean);
  }

  private obterHashtagsRelacionadas(termo: string, nicho: string): string[] {
    const texto = `${termo} ${nicho}`.toLowerCase();
    const mapa: Record<string, string[]> = {
      games: ['games', 'gamer', 'jogos', 'gameplay', 'setupgamer'],
      gamer: ['games', 'gamer', 'jogos', 'gameplay', 'setupgamer'],
      moda: ['moda', 'lookdodia', 'modafeminina', 'fashionbrasil'],
      beleza: ['beleza', 'skincare', 'maquiagem', 'cuidadoscomapele'],
      tecnologia: ['tecnologia', 'tech', 'inovacao', 'programacao'],
      fitness: ['fitness', 'academia', 'vidasaudavel', 'treino'],
      culinaria: ['culinaria', 'receitas', 'comida', 'gastronomia'],
      financas: ['financas', 'educacaofinanceira', 'investimentos'],
    };

    const hashtags = Object.entries(mapa)
      .filter(([chave]) => texto.includes(chave))
      .flatMap(([, valores]) => valores);

    return hashtags.map((hashtag) => this.normalizarHashtag(hashtag));
  }

  private normalizarHashtag(valor: string): string {
    return valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/^#/, '')
      .replace(/[^a-z0-9]/g, '');
  }

  private montarCacheKey(termo: string, quantidadeResultados: number): string {
    return `instagram:coleta:termo:${gerarSlug(termo)}:qtd:${quantidadeResultados}`;
  }

  private obterTtlCacheInstagram(): number {
    const ttl = Number(
      this.configService.get<string>('INSTAGRAM_CACHE_TTL_SECONDS'),
    );

    return Number.isNaN(ttl) ? 3600 : ttl;
  }
}
