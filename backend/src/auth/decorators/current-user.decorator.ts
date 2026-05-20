import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../interface/auth-user.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthUser;

    // Se passarmos um dado específico (ex: @CurrentUser('email')), retorna só ele.
    // Caso contrário, retorna o objeto de usuário completo.
    return data ? user?.[data] : user;
  },
);
