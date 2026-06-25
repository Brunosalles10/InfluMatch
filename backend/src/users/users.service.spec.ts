import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../redis/cache.service';
import { UsersService } from './users.service';
import { UserCacheInvalidationService } from './services/user-cache-invalidation.service';
import { UserPasswordService } from './services/user-password.service';

describe('UsersService', () => {
  let service: UsersService;

  const prismaMock = {
    usuario: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const cacheServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    deleteByPrefix: jest.fn(),
  };

  const userCacheInvalidationServiceMock = {
    invalidate: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn().mockReturnValue(10),
  };

  const userPasswordServiceMock = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

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
          provide: UserCacheInvalidationService,
          useValue: userCacheInvalidationServiceMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: UserPasswordService,
          useValue: userPasswordServiceMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve buscar usuário por email', async () => {
    const usuario = {
      id: '1',
      nome: 'Mariana',
      email: 'mariana@email.com',
      senha: '123456',
      ativo: true,
    };

    prismaMock.usuario.findUnique.mockResolvedValue(usuario);

    const resultado = await service.findByEmail('mariana@email.com');

    expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({
      where: {
        email: 'mariana@email.com',
      },
    });

    expect(resultado).toEqual(usuario);
  });

  it('deve retornar null quando o usuário não existir', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue(null);

    const resultado = await service.findByEmail('naoexiste@email.com');

    expect(resultado).toBeNull();

    expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({
      where: {
        email: 'naoexiste@email.com',
      },
    });
  });

  it('deve chamar o Prisma apenas uma vez', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue(null);

    await service.findByEmail('teste@email.com');

    expect(prismaMock.usuario.findUnique).toHaveBeenCalledTimes(1);
  });

  describe('create', () => {
    it('deve criar usuário com senha criptografada', async () => {
      const dto = {
        nome: 'Usuário Teste',
        email: 'teste@email.com',
        password: 'Senha@123',
      };

      prismaMock.usuario.findUnique.mockResolvedValue(null);

      userPasswordServiceMock.hash.mockResolvedValue('senha-criptografada');

      prismaMock.usuario.create.mockResolvedValue({
        id: '1',
        nome: dto.nome,
        email: dto.email,
        senha: 'senha-criptografada',
        role: 'USER',
      });

      const result = await service.create(dto);

      expect(userPasswordServiceMock.hash).toHaveBeenCalledWith('Senha@123');
      expect(prismaMock.usuario.create).toHaveBeenCalled();
      expect(result.email).toBe(dto.email);
      expect(userCacheInvalidationServiceMock.invalidate).toHaveBeenCalled();
    });
  });
});
