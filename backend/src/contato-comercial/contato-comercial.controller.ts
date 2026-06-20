import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContatoComercialService } from './contato-comercial.service';
import { ValidarContatoComercialDto } from './dto/validar-contato-comercial.dto';

@Controller('contato-comercial')
@ApiTags('Contato Comercial')
export class ContatoComercialController {
  constructor(
    private readonly contatoComercialService: ContatoComercialService,
  ) {}

  @Post('validar')
  @HttpCode(HttpStatus.OK)
  validar(@Body() dto: ValidarContatoComercialDto) {
    return this.contatoComercialService.validarContato(dto);
  }

  @Post('enviar')
  @HttpCode(HttpStatus.OK)
  enviar(@Body() dto: ValidarContatoComercialDto) {
    return this.contatoComercialService.enviarContato(dto);
  }
}
