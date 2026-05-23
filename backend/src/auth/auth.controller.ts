import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService, type UsuarioValidado } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @CurrentUser() user: UsuarioValidado,
  ) {
    this.logger.log(`Tentativa de login: ${loginDto.email}`);
    const result = await this.authService.login(user);
    this.logger.log(`Login bem-sucedido: ${user.email}`);
    return result;
  }
}
