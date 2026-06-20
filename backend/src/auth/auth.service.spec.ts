import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const usersServiceMock = {
    findByEmail: jest.fn(),
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
      role: 'USER',
    };

    usersServiceMock.findByEmail.mockResolvedValue(usuario);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const resultado = await service.validateUser('mariana@email.com', '123456');

    expect(resultado).toEqual({
      id: '1',
      nome: 'Mariana',
      email: 'mariana@email.com',
      ativo: true,
      role: 'USER',
    });
  });

  it('deve retornar null quando a senha estiver incorreta', async () => {
    const usuario = {
      id: '1',
      nome: 'Mariana',
      email: 'mariana@email.com',
      senha: 'senhaHash',
      ativo: true,
      role: 'USER',
    };

    usersServiceMock.findByEmail.mockResolvedValue(usuario);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

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
  });

  it('deve gerar um token JWT no login', async () => {
    jwtServiceMock.sign.mockReturnValue('token123');

    const usuario = {
      id: '1',
      nome: 'Mariana',
      email: 'mariana@email.com',
      role: 'USER',
    };

    const resultado = await service.login(usuario);

    expect(jwtServiceMock.sign).toHaveBeenCalledTimes(1);

    expect(resultado).toEqual({
      access_token: 'token123',
      user: usuario,
    });
  });
});
