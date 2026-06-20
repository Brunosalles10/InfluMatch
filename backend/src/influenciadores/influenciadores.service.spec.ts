import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { InfluenciadoresService } from './influenciadores.service';
import { InfluenciadoresRepository } from './influenciadores.repository';
import { InfluenciadorMapper } from './mappers/influenciador.mapper';

describe('InfluenciadoresService', () => {
  let service: InfluenciadoresService;

  const repositoryMock = {
    listar: jest.fn(),
    buscarPorId: jest.fn(),
    buscarPorNomeENicho: jest.fn(),
    criar: jest.fn(),
    atualizar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InfluenciadoresService,
        {
          provide: InfluenciadoresRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<InfluenciadoresService>(InfluenciadoresService);

    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('listar', () => {
    it('deve listar influenciadores', async () => {
      jest
        .spyOn(InfluenciadorMapper, 'paraResposta')
        .mockImplementation((i: any) => i);

      repositoryMock.listar.mockResolvedValue({
        data: [
          {
            id: '1',
            nome: 'Mariana',
          },
        ],
        total: 1,
      });

      const resultado = await service.listar({});

      expect(resultado.total).toBe(1);
      expect(resultado.page).toBe(1);
      expect(resultado.lastPage).toBe(1);
    });

    it('deve respeitar paginação', async () => {
      jest
        .spyOn(InfluenciadorMapper, 'paraResposta')
        .mockImplementation((i: any) => i);

      repositoryMock.listar.mockResolvedValue({
        data: [],
        total: 50,
      });

      const resultado = await service.listar({
        page: 2,
        limit: 10,
      });

      expect(resultado.page).toBe(2);
      expect(resultado.lastPage).toBe(5);
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar um influenciador', async () => {
      jest
        .spyOn(InfluenciadorMapper, 'paraResposta')
        .mockImplementation((i: any) => i);

      repositoryMock.buscarPorId.mockResolvedValue({
        id: '1',
        nome: 'Mariana',
      });

      const resultado = await service.buscarPorId('1');

      expect(resultado.id).toBe('1');
    });

    it('deve lançar NotFoundException', async () => {
      repositoryMock.buscarPorId.mockResolvedValue(null);

      await expect(service.buscarPorId('100')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('buscarOuCriar', () => {
    it('deve atualizar influenciador existente', async () => {
      repositoryMock.buscarPorNomeENicho.mockResolvedValue({
        id: '1',
        nome: 'Mariana',
        descricao: 'Desc',
        imagemUrl: 'img.png',
      });

      repositoryMock.atualizar.mockResolvedValue({
        id: '1',
        nome: 'Mariana',
      });

      const resultado = await service.buscarOuCriar({
        nome: 'Mariana',
      });

      expect(repositoryMock.atualizar).toHaveBeenCalled();
      expect(resultado.id).toBe('1');
    });

    it('deve criar influenciador quando não existir', async () => {
      repositoryMock.buscarPorNomeENicho.mockResolvedValue(null);

      repositoryMock.criar.mockResolvedValue({
        id: '2',
        nome: 'Novo',
      });

      const resultado = await service.buscarOuCriar({
        nome: 'Novo',
      });

      expect(repositoryMock.criar).toHaveBeenCalled();
      expect(resultado.id).toBe('2');
    });

    it('deve criar influenciador conectando um nicho', async () => {
      repositoryMock.buscarPorNomeENicho.mockResolvedValue(null);

      repositoryMock.criar.mockResolvedValue({
        id: '3',
      });

      await service.buscarOuCriar({
        nome: 'Novo',
        nichoId: 'abc',
      });

      expect(repositoryMock.criar).toHaveBeenCalledWith(
        expect.objectContaining({
          nicho: {
            connect: {
              id: 'abc',
            },
          },
        }),
      );
    });
  });
});
