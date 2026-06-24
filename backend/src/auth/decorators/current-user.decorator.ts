import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AuthUser } from '../interface/auth-user.interface';
import type { AuthenticatedRequest } from '../interface/authenticated-request.interface';

/**
 * Retorna o usuário autenticado ou uma propriedade específica dele.
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    const user = request.user;

    return data ? user?.[data] : user;
  },
);
