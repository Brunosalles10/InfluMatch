import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { type Nicho } from '@prisma/client';
import { gerarSlug } from 'src/common/utils/slug.util';
import { CriarNichoDto } from './dto/criar-nicho.dto';
import { ListarNichosDto } from './dto/listar-nichos.dto';
import { NichosRepository } from './nichos.repository';

@Injectable()
export class NichosService {
  private readonly logger = new Logger(NichosService.name);

  constructor(private readonly nichosRepository: NichosRepository) {}

  /**
   * Cria um novo nicho, impedindo cadastro duplicado pelo slug.
   */
  async criar(dto: CriarNichoDto): Promise<Nicho> {
    const nome = dto.nome.trim();
    const slug = gerarSlug(nome);

    const nichoExistente = await this.nichosRepository.buscarPorSlug(slug);

    if (nichoExistente) {
      throw new BadRequestException(
        'Já existe um nicho cadastrado com esse nome.',
      );
    }

    this.logger.log(`Criando nicho: ${nome}`);

    return this.nichosRepository.criar({
      nome,
      slug,
    });
  }

  /**
   * Lista nichos, aplicando busca por nome ou slug quando informado.
   */
  listar(filtros: ListarNichosDto): Promise<Nicho[]> {
    return this.nichosRepository.listar(filtros.busca);
  }

  /**
   * Busca um nicho pelo ID e retorna erro quando ele não existir.
   */
  async buscarPorId(id: string): Promise<Nicho> {
    const nicho = await this.nichosRepository.buscarPorId(id);

    if (!nicho) {
      throw new NotFoundException('Nicho não encontrado.');
    }

    return nicho;
  }

  /**
   * Retorna um nicho existente pelo nome ou cria automaticamente quando não existir.
   */
  async buscarOuCriarPorNome(nome: string): Promise<Nicho> {
    const nomeNormalizado = nome.trim();
    const slug = gerarSlug(nomeNormalizado);

    const nichoExistente = await this.nichosRepository.buscarPorSlug(slug);

    if (nichoExistente) {
      return nichoExistente;
    }

    this.logger.log(`Criando nicho automaticamente: ${nomeNormalizado}`);

    return this.nichosRepository.criar({
      nome: nomeNormalizado,
      slug,
    });
  }
}
