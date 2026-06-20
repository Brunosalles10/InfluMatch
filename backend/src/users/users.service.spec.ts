import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../redis/cache.service';
import { HandlePostActionsUtil } from './utils/handlePostActions';
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

  const cacheMock = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    deleteByPrefix: jest.fn(),
  };

  const handlePostActionsMock = {
    execute: jest.fn(),
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
          useValue: cacheMock,
        },
        {
          provide: HandlePostActionsUtil,
          useValue: handlePostActionsMock,
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
});
