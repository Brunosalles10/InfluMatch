import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { NichosService } from './nichos.service';
import { NichosRepository } from './nichos.repository';

describe('NichosService', () => {
  let service: NichosService;

  const nichosRepositoryMock = {
    criar: jest.fn(),
    listar: jest.fn(),
    buscarPorId: jest.fn(),
    buscarPorSlug: jest.fn(),
    buscarPorNome: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NichosService,
        {
          provide: NichosRepository,
          useValue: nichosRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<NichosService>(NichosService);

    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('criar', () => {
    it('deve criar um novo nicho', async () => {
      nichosRepositoryMock.buscarPorSlug.mockResolvedValue(null);

      nichosRepositoryMock.criar.mockResolvedValue({
        id: '1',
        nome: 'Tecnologia',
        slug: 'tecnologia',
      });

      const resultado = await service.criar({
        nome: 'Tecnologia',
      });

      expect(nichosRepositoryMock.buscarPorSlug).toHaveBeenCalledTimes(1);

      expect(nichosRepositoryMock.criar).toHaveBeenCalledWith({
        nome: 'Tecnologia',
        slug: 'tecnologia',
      });

      expect(resultado.nome).toBe('Tecnologia');
    });

    it('deve lançar erro quando o nicho já existir', async () => {
      nichosRepositoryMock.buscarPorSlug.mockResolvedValue({
        id: '1',
        nome: 'Tecnologia',
        slug: 'tecnologia',
      });

      await expect(
        service.criar({
          nome: 'Tecnologia',
        }),
      ).rejects.toThrow(BadRequestException);

      expect(nichosRepositoryMock.criar).not.toHaveBeenCalled();
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar um nicho existente', async () => {
      nichosRepositoryMock.buscarPorId.mockResolvedValue({
        id: '1',
        nome: 'Tecnologia',
      });

      const resultado = await service.buscarPorId('1');

      expect(resultado.id).toBe('1');
    });

    it('deve lançar NotFoundException quando não encontrar o nicho', async () => {
      nichosRepositoryMock.buscarPorId.mockResolvedValue(null);

      await expect(service.buscarPorId('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('buscarOuCriarPorNome', () => {
    it('deve retornar o nicho existente', async () => {
      const nicho = {
        id: '1',
        nome: 'Tecnologia',
        slug: 'tecnologia',
      };

      nichosRepositoryMock.buscarPorSlug.mockResolvedValue(nicho);

      const resultado = await service.buscarOuCriarPorNome('Tecnologia');

      expect(resultado).toEqual(nicho);

      expect(nichosRepositoryMock.criar).not.toHaveBeenCalled();
    });

    it('deve criar um novo nicho caso não exista', async () => {
      nichosRepositoryMock.buscarPorSlug.mockResolvedValue(null);

      nichosRepositoryMock.criar.mockResolvedValue({
        id: '2',
        nome: 'Games',
        slug: 'games',
      });

      const resultado = await service.buscarOuCriarPorNome('Games');

      expect(nichosRepositoryMock.criar).toHaveBeenCalled();

      expect(resultado.nome).toBe('Games');
    });
  });
});
