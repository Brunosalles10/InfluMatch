import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConteudosModule } from 'src/conteudos/conteudos.module';
import { InfluenciadoresModule } from 'src/influenciadores/influenciadores.module';
import { NichosModule } from 'src/nichos/nichos.module';
import { PerfisSociaisModule } from 'src/perfis-sociais/perfis-sociais.module';
import { RedisModule } from 'src/redis/redis.module';
import { YoutubeController } from './youtube.controller';
import { YoutubeClient } from './youtube.client';
import { YoutubeMapper } from './mappers/youtube.mapper';
import { YoutubeService } from './youtube.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 3,
    }),
    RedisModule,
    NichosModule,
    InfluenciadoresModule,
    PerfisSociaisModule,
    ConteudosModule,
  ],
  controllers: [YoutubeController],
  providers: [YoutubeService, YoutubeClient, YoutubeMapper],
  exports: [YoutubeService],
})
export class YoutubeModule {}
