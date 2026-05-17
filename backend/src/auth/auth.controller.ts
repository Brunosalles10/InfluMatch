import {
  Body,
  Controller,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Request() req: Request & { user: any },
  ) {
    this.logger.log(`Tentativa de login: ${loginDto.email}`);
    const result = await this.authService.login(req.user);
    this.logger.log(`Login bem-sucedido: ${req.user.email}`);
    return result;
  }
}
