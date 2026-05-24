import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { gerarSlug } from 'src/common/utils/slug.util';
import { CriarNichoDto } from './dto/criar-nicho.dto';
import { ListarNichosDto } from './dto/listar-nichos.dto';
import { NichosRepository } from './nichos.repository';

@Injectable()
export class NichosService {
  private readonly logger = new Logger(NichosService.name);

  constructor(private readonly nichosRepository: NichosRepository) {}

  async criar(dto: CriarNichoDto) {
    const slug = gerarSlug(dto.nome);

    const nichoExistente = await this.nichosRepository.buscarPorSlug(slug);

    if (nichoExistente) {
      throw new BadRequestException(
        'Já existe um nicho cadastrado com esse nome.',
      );
    }

    this.logger.log(`Criando nicho: ${dto.nome}`);

    return this.nichosRepository.criar({
      nome: dto.nome,
      slug,
    });
  }

  listar(filtros: ListarNichosDto) {
    return this.nichosRepository.listar(filtros.busca);
  }

  async buscarPorId(id: string) {
    const nicho = await this.nichosRepository.buscarPorId(id);

    if (!nicho) {
      throw new NotFoundException('Nicho não encontrado.');
    }

    return nicho;
  }

  async buscarOuCriarPorNome(nome: string) {
    const slug = gerarSlug(nome);
    const nichoExistente = await this.nichosRepository.buscarPorSlug(slug);

    if (nichoExistente) {
      return nichoExistente;
    }

    this.logger.log(`Criando nicho automaticamente: ${nome}`);

    return this.nichosRepository.criar({
      nome: nome.trim(),
      slug,
    });
  }
}
