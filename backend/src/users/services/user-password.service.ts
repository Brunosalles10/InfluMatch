import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

/**
 * Centraliza a geração e a comparação segura de hashes de senha.
 */
@Injectable()
export class UserPasswordService {
  private readonly logger = new Logger(UserPasswordService.name);
  private readonly saltRounds: number;

  /**
   * Obtém o custo do bcrypt ou utiliza 12 quando a configuração é inválida.
   */
  constructor(private readonly configService: ConfigService) {
    const envSalt = this.configService.get<string>('BCRYPT_SALT_ROUNDS');
    const parsedSalt = Number.parseInt(envSalt ?? '', 10);

    this.saltRounds = Number.isNaN(parsedSalt) ? 12 : parsedSalt;

    this.logger.log(`BCRYPT_SALT_ROUNDS configurado em: ${this.saltRounds}`);
  }

  /**
   * Gera um hash irreversível para a senha informada.
   */
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Verifica se uma senha em texto corresponde ao hash armazenado.
   */
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
