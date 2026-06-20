import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserPasswordService {
  private readonly logger = new Logger(UserPasswordService.name);
  private readonly saltRounds: number;

  constructor(private readonly configService: ConfigService) {
    const envSalt = this.configService.get<string>('BCRYPT_SALT_ROUNDS');

    this.saltRounds = envSalt ? Number(envSalt) : 12;

    this.logger.log(`BCRYPT_SALT_ROUNDS configurado em: ${this.saltRounds}`);
  }

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
