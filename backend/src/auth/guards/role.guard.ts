import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthUser } from '../interface/auth-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthUser;
    const route = `${request.method} ${request.url}`;

    //  Se a rota não tem o decorator @Roles, o acesso é livre
    if (!requiredRoles || requiredRoles.length === 0) {
      return this.allow(`Rota sem restrição de role: ${route}`);
    }

    // Verifica se o usuário existe no request
    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    //acesso total para ADMIN
    if (user.role === 'ADMIN') {
      return this.allow('Administrador tem acesso total');
    }

    // Verifica se a role do usuário está na lista exigida
    if (requiredRoles.includes(user.role)) {
      return this.allow(`Usuário com role "${user.role}" tem acesso à rota`);
    }

    // Acesso negado
    this.logger.warn(
      `Acesso negado: Usuário ${user.email} (role: ${user.role}) tentou acessar ${route}`,
    );
    throw new ForbiddenException('Seu nível de acesso não permite esta ação.');
  }

  private allow(mensagem: string): boolean {
    this.logger.log(`ACESSO PERMITIDO: ${mensagem}`);
    return true;
  }
}
