import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../redis/cache.service';
import { UsersService } from './users.service';
import { HandlePostActionsUtil } from './utils/handlePostActions';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;

  const prismaMock = {
    usuario: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const cacheServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const handlePostActionsMock = {
    execute: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn().mockReturnValue(10),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,

        {
          provide: PrismaService,
          useValue: prismaMock,
        },

        {
          provide: CacheService,
          useValue: cacheServiceMock,
        },

        {
          provide: HandlePostActionsUtil,
          useValue: handlePostActionsMock,
        },

        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar usuário com senha criptografada', async () => {
      const dto = {
        nome: 'Usuário Teste',
        email: 'teste@email.com',
        password: 'Senha@123',
      };

      prismaMock.usuario.findUnique.mockResolvedValue(null);

      (bcrypt.hash as jest.Mock).mockResolvedValue('senha-criptografada');

      prismaMock.usuario.create.mockResolvedValue({
        id: '1',
        nome: dto.nome,
        email: dto.email,
        senha: 'senha-criptografada',
        role: 'USER',
      });

      const result = await service.create(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith('Senha@123', 10);

      expect(prismaMock.usuario.create).toHaveBeenCalled();

      expect(result.email).toBe(dto.email);

      expect(handlePostActionsMock.execute).toHaveBeenCalled();
    });
  });
});
