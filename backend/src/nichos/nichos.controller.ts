import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { CriarNichoDto } from './dto/criar-nicho.dto';
import { ListarNichosDto } from './dto/listar-nichos.dto';
import { NichosService } from './nichos.service';

@Controller('nichos')
@ApiTags('Nichos')
@ApiBearerAuth('JWT-auth')
export class NichosController {
  constructor(private readonly nichosService: NichosService) {}

  @Get()
  listar(@Query() filtros: ListarNichosDto) {
    return this.nichosService.listar(filtros);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.nichosService.buscarPorId(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  criar(@Body() dto: CriarNichoDto) {
    return this.nichosService.criar(dto);
  }
}
