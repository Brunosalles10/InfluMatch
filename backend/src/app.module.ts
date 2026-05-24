import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ConteudosModule } from './conteudos/conteudos.module';
import { InfluenciadoresModule } from './influenciadores/influenciadores.module';
import { NichosModule } from './nichos/nichos.module';
import { PerfisSociaisModule } from './perfis-sociais/perfis-sociais.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    AuthModule,
    NichosModule,
    PerfisSociaisModule,
    InfluenciadoresModule,
    ConteudosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
