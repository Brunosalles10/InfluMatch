import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserPasswordService {
  private readonly logger = new Logger(UserPasswordService.name);
  private readonly saltRounds: number;

  constructor(private readonly configService: ConfigService) {
    const envSalt = this.configService.get('BCRYPT_SALT_ROUNDS');
    const parsedSalt = parseInt(envSalt, 10);

    this.saltRounds = isNaN(parsedSalt) ? 12 : parsedSalt;

    this.logger.log(`BCRYPT_SALT_ROUNDS configurado em: ${this.saltRounds}`);
  }

  hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
