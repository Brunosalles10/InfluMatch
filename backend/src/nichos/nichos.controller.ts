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
import { type Nicho } from '@prisma/client';
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

  /**
   * Lista os nichos cadastrados, com filtro opcional por texto.
   */
  @Get()
  listar(@Query() filtros: ListarNichosDto): Promise<Nicho[]> {
    return this.nichosService.listar(filtros);
  }

  /**
   * Busca um nicho específico pelo ID.
   */
  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string): Promise<Nicho> {
    return this.nichosService.buscarPorId(id);
  }

  /**
   * Cria um novo nicho. Apenas administradores podem acessar esta rota.
   */
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  criar(@Body() dto: CriarNichoDto): Promise<Nicho> {
    return this.nichosService.criar(dto);
  }
}
