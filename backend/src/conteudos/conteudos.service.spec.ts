import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ConteudosService } from './conteudos.service';
import { ConteudosRepository } from './conteudos.repository';
import { ConteudoMapper } from './mappers/conteudo.mapper';
import { OrdenacaoConteudo } from './dto/listar-conteudos.dto';

describe('ConteudosService', () => {
  let service: ConteudosService;

  const repositoryMock = {
    listar: jest.fn(),
    buscarPorId: jest.fn(),
    upsertPorIdentificador: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConteudosService,
        {
          provide: ConteudosRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<ConteudosService>(ConteudosService);

    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('listar', () => {
    it('deve listar conteúdos', async () => {
      jest
        .spyOn(ConteudoMapper, 'paraResposta')
        .mockImplementation((c: any) => c);

      repositoryMock.listar.mockResolvedValue({
        data: [{ id: '1', titulo: 'Vídeo' }],
        total: 1,
      });

      const resultado = await service.listar({});

      expect(resultado.total).toBe(1);
      expect(resultado.page).toBe(1);
      expect(resultado.lastPage).toBe(1);
    });

    it('deve utilizar ordenação padrão', async () => {
      jest
        .spyOn(ConteudoMapper, 'paraResposta')
        .mockImplementation((c: any) => c);

      repositoryMock.listar.mockResolvedValue({
        data: [],
        total: 0,
      });

      await service.listar({});

      expect(repositoryMock.listar).toHaveBeenCalledWith(
        expect.objectContaining({
          ordenarPor: OrdenacaoConteudo.VIRAL,
        }),
      );
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar conteúdo existente', async () => {
      jest
        .spyOn(ConteudoMapper, 'paraResposta')
        .mockImplementation((c: any) => c);

      repositoryMock.buscarPorId.mockResolvedValue({
        id: '1',
      });

      const resultado = await service.buscarPorId('1');

      expect(resultado.id).toBe('1');
    });

    it('deve lançar NotFoundException', async () => {
      repositoryMock.buscarPorId.mockResolvedValue(null);

      await expect(service.buscarPorId('10')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('upsertPorIdentificador', () => {
    it('deve chamar o repository', async () => {
      repositoryMock.upsertPorIdentificador.mockResolvedValue({
        id: '1',
      });

      const params: any = {
        plataforma: 'YOUTUBE',
        identificadorExterno: 'abc123',
        dataCreate: {},
        dataUpdate: {},
      };

      const resultado = await service.upsertPorIdentificador(params);

      expect(repositoryMock.upsertPorIdentificador).toHaveBeenCalledWith(
        params,
      );

      expect(resultado.id).toBe('1');
    });
  });

  describe('calcularTaxaEngajamento', () => {
    it('deve calcular corretamente', () => {
      const taxa = service.calcularTaxaEngajamento(100, 50, 1000);

      expect(taxa).toBe(15);
    });

    it('deve retornar zero quando não houver visualizações', () => {
      const taxa = service.calcularTaxaEngajamento(100, 20, 0);

      expect(taxa).toBe(0);
    });

    it('deve arredondar para duas casas decimais', () => {
      const taxa = service.calcularTaxaEngajamento(10, 5, 333);

      expect(taxa).toBeCloseTo(4.5, 2);
    });
  });
});
