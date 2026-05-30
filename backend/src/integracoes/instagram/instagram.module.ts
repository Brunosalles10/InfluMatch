import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisModule } from 'src/redis/redis.module';
import { InstagramController } from './instagram.controller';
import { InstagramClient } from './instagram.client';
import { InstagramMapper } from './mappers/instagram.mapper';
import { InstagramRepository } from './instagram.repository';
import { InstagramService } from './instagram.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 3,
    }),
    PrismaModule,
    RedisModule,
  ],
  controllers: [InstagramController],
  providers: [
    InstagramService,
    InstagramClient,
    InstagramMapper,
    InstagramRepository,
  ],
  exports: [InstagramService],
})
export class InstagramModule {}
