import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  //valida o usuário pelo email e senha
  async validateUser(email: string, password: string) {
    this.logger.debug(`Validando usuário: ${email}`);

    //busca o usuário pelo email
    const user = await this.usersService.findByEmail(email);

    //compara a senha informada com a senha armazenada
    if (!user) {
      this.logger.debug(`Usuário não encontrado: ${email}`);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.senha);
    if (!isPasswordValid) {
      this.logger.debug(`Senha inválida para o usuário: ${email}`);
      return null;
    }

    const { senha, ...result } = user;
    return result;
  }

  //realiza o login do usuário
  async login(loginDto: LoginDto) {
    this.logger.log(`📝 Tentativa de login: ${loginDto.email}`);
    //busca o usuário pelo email
    const user = await this.usersService.findByEmail(loginDto.email);
    this.logger.debug(`Buscando usuário: ${loginDto.email}`);
    //se o usuário não for encontrado, lança uma exceção
    if (!user) {
      this.logger.warn(
        `Tentativa de login falhou para o email: ${loginDto.email}`,
      );
      throw new UnauthorizedException('Usuário não encontrado');
    }

    //verifica se a senha informada é válida
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.senha);

    //se a senha for inválida, lança uma exceção
    if (!isPasswordValid) {
      this.logger.warn(
        `Tentativa de login falhou para o email: ${loginDto.email} - Credenciais inválidas`,
      );
      throw new UnauthorizedException('Credenciais inválidas');
    }

    this.logger.log(` Login bem-sucedido: ${user.email}`);

    //cria o payload do token JWT
    const payload = { sub: user.id, email: user.email, role: user.role };

    const access_token = this.jwtService.sign(payload);

    this.logger.log(`🔐 Token JWT gerado para: ${user.email}`);

    //retorna o token JWT e os dados do usuário
    return {
      access_token: access_token, //usara o segredo definido no módulo de autenticação
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    };
  }
}
