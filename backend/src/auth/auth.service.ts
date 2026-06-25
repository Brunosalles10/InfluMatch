import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserMapper, type UserResponse } from '../users/mappers/user.mapper';
import { UserPasswordService } from '../users/services/user-password.service';
import { UsersService } from '../users/users.service';

export type UsuarioValidado = UserResponse;

export interface LoginResponse {
  access_token: string;
  user: Pick<UsuarioValidado, 'id' | 'nome' | 'email' | 'role'>;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly userPasswordService: UserPasswordService,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * Confere e-mail, situação da conta e senha, retornando dados sem o hash.
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<UsuarioValidado | null> {
    this.logger.debug(`Validando usuário: ${email}`);

    const usuario = await this.usersService.findByEmail(email);

    if (!usuario || !usuario.ativo) {
      return null;
    }

    const senhaValida = await this.userPasswordService.compare(
      password,
      usuario.senha,
    );

    if (!senhaValida) {
      return null;
    }

    return UserMapper.toResponse(usuario);
  }

  /**
   * Gera o JWT e retorna os dados públicos da sessão autenticada.
   */
  login(user: UsuarioValidado): LoginResponse {
    this.logger.log(`Gerando token JWT para: ${user.email}`);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    };
  }
}
