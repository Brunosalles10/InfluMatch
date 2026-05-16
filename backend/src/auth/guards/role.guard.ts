import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthUser } from '../interface/auth-user.interface';

interface RequestWithUser {
  user: AuthUser;
  params: { id?: string };
  method: string;
  url: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    //verifica se a rota requer roles espcificas
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { user, method, url, params } = request;
    const route = `${method} ${url}`;

    this.logger.log(`Verificando permissões para: ${route}`);

    if (!requiredRoles) {
      return this.allow(`Rota pública: ${route}`);
    }

    if (!user?.role) this.deny('Usuário não autenticado ou sem role definida');

    if (user.role === 'ADMIN')
      return this.allow('administrador tem acesso total');

    if (this.hasRole(user.role, requiredRoles)) {
      return this.allow(`Usuário com role "${user.role}" tem acesso à rota`);
    }

    if (params.id) {
      if (this.isOwner(user.sub, params.id)) {
        return this.allow(
          `Usuário ${user.email} é dono do recurso ${params.id}`,
        );
      }
    }

    this.deny(
      `Usuário ${user.email} (role: ${user.role}) tentou acessar ${route} sem permissão`,
    );
  }

  //verifica a role do usuario
  private hasRole(userRole: string, roles: string[]): boolean {
    return roles.includes(userRole);
  }

  //verifica se o usuario e dono do recurso
  private isOwner(userId: string, resourceId: string): boolean {
    return userId === resourceId;
  }

  //registra log de sucesso
  private allow(mensagem: string): boolean {
    this.logger.log(`ACESSO PERMITIDO: ${mensagem}`);
    return true;
  }

  //registra log de falha
  private deny(motivo: string): never {
    this.logger.warn(`ACESSO NEGADO: ${motivo}`);
    throw new ForbiddenException('Acesso negado: permissões insuficientes');
  }
}
