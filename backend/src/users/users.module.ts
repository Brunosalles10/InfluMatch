import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { UserCacheInvalidationService } from './services/user-cache-invalidation.service';
import { UserPasswordService } from './services/user-password.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [RedisModule, PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UserCacheInvalidationService, UserPasswordService],
  exports: [UsersService, UserPasswordService],
})
export class UsersModule {}
