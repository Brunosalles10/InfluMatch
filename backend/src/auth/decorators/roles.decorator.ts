import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

//decorator customizado para definir quais roles podem acessar
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
