import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { ContatoComercialController } from './contato-comercial.controller';
import { ContatoComercialService } from './contato-comercial.service';

@Module({
  imports: [EmailModule],
  controllers: [ContatoComercialController],
  providers: [ContatoComercialService],
})
export class ContatoComercialModule {}
