import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HandlePostActionsUtil } from './utils/handlePostActions';

@Module({
  imports: [RedisModule, PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, HandlePostActionsUtil],
  exports: [UsersService],
})
export class UsersModule {}
