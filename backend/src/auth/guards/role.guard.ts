import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { AuthenticatedRequest } from '../interface/authenticated-request.interface';
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  /**
   * Autoriza a requisição comparando a role do usuário com as roles da rota.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const user = request.user;
    const route = `${request.method} ${request.originalUrl}`;

    if (!requiredRoles?.length) {
      return true;
    }

    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    if (user.role === Role.ADMIN) {
      return true;
    }

    if (requiredRoles.includes(user.role)) {
      return true;
    }

    this.logger.warn(
      `Acesso negado: Usuário ${user.email} (role: ${user.role}) tentou acessar ${route}`,
    );
    throw new ForbiddenException('Seu nível de acesso não permite esta ação.');
  }
}
