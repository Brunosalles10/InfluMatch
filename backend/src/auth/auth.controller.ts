import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthService,
  type LoginResponse,
  type UsuarioValidado,
} from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Autentica o usuário validado pela estratégia local e gera sua sessão.
   */
  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(
    @Body() loginDto: LoginDto,
    @CurrentUser() user: UsuarioValidado,
  ): LoginResponse {
    const resultado = this.authService.login(user);

    this.logger.log(`Login bem-sucedido: ${loginDto.email}`);

    return resultado;
  }
}
