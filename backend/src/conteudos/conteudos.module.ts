import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConteudosController } from './conteudos.controller';
import { ConteudosRepository } from './conteudos.repository';
import { ConteudosService } from './conteudos.service';

@Module({
  imports: [PrismaModule],
  controllers: [ConteudosController],
  providers: [ConteudosService, ConteudosRepository],
  exports: [ConteudosService, ConteudosRepository],
})
export class ConteudosModule {}
