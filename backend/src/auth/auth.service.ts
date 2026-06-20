import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

export type UsuarioValidado = Omit<Usuario, 'senha'>;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UsuarioValidado | null> {
    this.logger.debug(`Validando usuário: ${email}`);

    const usuario = await this.usersService.findByEmail(email);

    if (usuario?.ativo && (await bcrypt.compare(password, usuario.senha))) {
      const { senha, ...result } = usuario;
      return result;
    }

    return null;
  }

  async login(user: UsuarioValidado) {
    this.logger.log(`Gerando Token JWT para: ${user.email}`);

    const payload = { sub: user.id, email: user.email, role: user.role };

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
