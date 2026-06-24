import { Global, Logger, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const logger = new Logger('RedisClient');

        const client = new Redis({
          host: process.env.REDIS_HOST || 'redis',
          port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
        });

        client.on('connect', () => {
          logger.log('Conectado ao Redis com sucesso!');
        });

        client.on('error', (err) => {
          logger.error(`Erro na conexão com o Redis: ${err.message}`);
        });

        return client;
      },
    },
    CacheService,
  ],
  exports: ['REDIS_CLIENT', CacheService],
})
export class RedisModule {}
