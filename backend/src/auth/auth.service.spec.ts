import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserPasswordService } from '../users/services/user-password.service';
import { Role } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;

  const usersServiceMock = {
    findByEmail: jest.fn(),
  };

  const userPasswordServiceMock = {
    compare: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: UserPasswordService,
          useValue: userPasswordServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve validar um usuário com credenciais corretas', async () => {
    const usuario = {
      id: '1',
      nome: 'Mariana',
      email: 'mariana@email.com',
      senha: 'senhaHash',
      ativo: true,
      role: Role.USER,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };

    usersServiceMock.findByEmail.mockResolvedValue(usuario);
    userPasswordServiceMock.compare.mockResolvedValue(true);

    const resultado = await service.validateUser('mariana@email.com', '123456');

    expect(userPasswordServiceMock.compare).toHaveBeenCalledWith(
      '123456',
      'senhaHash',
    );

    expect(resultado).toEqual({
      id: '1',
      nome: 'Mariana',
      email: 'mariana@email.com',
      ativo: true,
      role: Role.USER,
      criadoEm: usuario.criadoEm,
      atualizadoEm: usuario.atualizadoEm,
    });
  });

  it('deve retornar null quando a senha estiver incorreta', async () => {
    const usuario = {
      id: '1',
      nome: 'Mariana',
      email: 'mariana@email.com',
      senha: 'senhaHash',
      ativo: true,
      role: Role.USER,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };

    usersServiceMock.findByEmail.mockResolvedValue(usuario);
    userPasswordServiceMock.compare.mockResolvedValue(false);

    const resultado = await service.validateUser(
      'mariana@email.com',
      'senhaErrada',
    );

    expect(resultado).toBeNull();
  });

  it('deve retornar null quando o usuário não existir', async () => {
    usersServiceMock.findByEmail.mockResolvedValue(null);

    const resultado = await service.validateUser('teste@email.com', '123456');

    expect(resultado).toBeNull();

    expect(userPasswordServiceMock.compare).not.toHaveBeenCalled();
  });

  it('deve gerar um token JWT no login', () => {
    jwtServiceMock.sign.mockReturnValue('token123');

    const usuario = {
      id: '1',
      nome: 'Mariana',
      email: 'mariana@email.com',
      role: Role.USER,
      ativo: true,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };

    const resultado = service.login(usuario);

    expect(jwtServiceMock.sign).toHaveBeenCalledWith({
      sub: '1',
      email: 'mariana@email.com',
      role: Role.USER,
    });

    expect(resultado).toEqual({
      access_token: 'token123',
      user: {
        id: '1',
        nome: 'Mariana',
        email: 'mariana@email.com',
        role: Role.USER,
      },
    });
  });
});
