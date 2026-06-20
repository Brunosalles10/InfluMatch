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
import { ColetarYoutubeDto } from './dto/coletar-youtube.dto';
import { ResumoColetaYoutubeDto } from './dto/resumo-coleta-youtube.dto';
import { YoutubeService } from './youtube.service';

@Controller('integracoes/youtube')
@ApiTags('Integração YouTube')
@ApiBearerAuth('JWT-auth')
export class YoutubeController {
  private readonly logger = new Logger(YoutubeController.name);

  constructor(private readonly youtubeService: YoutubeService) {}

  @Post('coletar')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'USER')
  @HttpCode(HttpStatus.OK)
  coletarPorNicho(
    @Body() dto: ColetarYoutubeDto,
  ): Promise<ResumoColetaYoutubeDto> {
    this.logger.log(`Solicitação de coleta YouTube para nicho: ${dto.nicho}`);
    return this.youtubeService.coletarPorNicho(dto);
  }
}
