import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { hashPasswordMiddleware } from './middleware/hash-password.middleware';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['warn', 'error'],
    });

    // Registra o middleware de hash de senha
    this.$use(hashPasswordMiddleware);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log(' Conectado ao banco de dados com sucesso!');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido';
      this.logger.error(` Erro ao conectar ao banco: ${message}`);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log(' Desconectado do banco de dados');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido';
      this.logger.error(` Erro ao desconectar: ${message}`);
      throw error;
    }
  }
}
