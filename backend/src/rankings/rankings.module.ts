import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisModule } from 'src/redis/redis.module';
import { RankingsController } from './rankings.controller';
import { RankingsRepository } from './rankings.repository';
import { RankingsService } from './rankings.service';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [RankingsController],
  providers: [RankingsService, RankingsRepository],
  exports: [RankingsService, RankingsRepository],
})
export class RankingsModule {}
