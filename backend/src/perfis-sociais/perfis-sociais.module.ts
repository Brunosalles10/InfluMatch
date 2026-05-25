import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PerfisSociaisController } from './perfis-sociais.controller';
import { PerfisSociaisRepository } from './perfis-sociais.repository';
import { PerfisSociaisService } from './perfis-sociais.service';

@Module({
  imports: [PrismaModule],
  controllers: [PerfisSociaisController],
  providers: [PerfisSociaisService, PerfisSociaisRepository],
  exports: [PerfisSociaisService, PerfisSociaisRepository],
})
export class PerfisSociaisModule {}
