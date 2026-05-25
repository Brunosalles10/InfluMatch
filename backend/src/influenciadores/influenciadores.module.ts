import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { InfluenciadoresController } from './influenciadores.controller';
import { InfluenciadoresRepository } from './influenciadores.repository';
import { InfluenciadoresService } from './influenciadores.service';

@Module({
  imports: [PrismaModule],
  controllers: [InfluenciadoresController],
  providers: [InfluenciadoresService, InfluenciadoresRepository],
  exports: [InfluenciadoresService, InfluenciadoresRepository],
})
export class InfluenciadoresModule {}
