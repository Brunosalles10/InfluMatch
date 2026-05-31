import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { ColetarInstagramDto } from './dto/coletar-instagram.dto';
import { ResumoColetaInstagramDto } from './dto/resumo-coleta-instagram.dto';
import { InstagramService } from './instagram.service';

@Controller('integracoes/instagram')
@ApiTags('Integração Instagram')
@ApiBearerAuth('JWT-auth')
export class InstagramController {
  private readonly logger = new Logger(InstagramController.name);

  constructor(private readonly instagramService: InstagramService) {}

  @Post('coletar')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  coletarPorTermo(
    @Body() dto: ColetarInstagramDto,
  ): Promise<ResumoColetaInstagramDto> {
    this.logger.log(`Solicitação de coleta Instagram para termo: ${dto.termo}`);
    return this.instagramService.coletarPorTermo(dto);
  }
}
