import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NichosController } from './nichos.controller';
import { NichosRepository } from './nichos.repository';
import { NichosService } from './nichos.service';

@Module({
  imports: [PrismaModule],
  controllers: [NichosController],
  providers: [NichosService, NichosRepository],
  exports: [NichosService, NichosRepository],
})
export class NichosModule {}
