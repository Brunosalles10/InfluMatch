import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Define as roles autorizadas a acessar uma rota ou controller.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
