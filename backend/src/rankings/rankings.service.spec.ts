import { Test, TestingModule } from '@nestjs/testing';
import { RankingsService } from './rankings.service';
import { RankingsRepository } from './rankings.repository';
import { CacheService } from '../redis/cache.service';

describe('RankingsService', () => {
  let service: RankingsService;

  const rankingsRepositoryMock = {
    listarConteudos: jest.fn(),
    listarInfluenciadores: jest.fn(),
    buscarMediasEngajamentoPorPerfis: jest.fn(),
  };

  const cacheServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingsService,
        {
          provide: RankingsRepository,
          useValue: rankingsRepositoryMock,
        },
        {
          provide: CacheService,
          useValue: cacheServiceMock,
        },
      ],
    }).compile();

    service = module.get<RankingsService>(RankingsService);

    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });
});
