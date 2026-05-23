// src/users/mappers/user.mapper.ts

import { Prisma, Usuario } from '@prisma/client';

export const userSafeSelect = {
  id: true,
  nome: true,
  email: true,
  role: true,
  ativo: true,
  criadoEm: true,
  atualizadoEm: true,
} satisfies Prisma.UsuarioSelect;

export type UserResponse = Prisma.UsuarioGetPayload<{
  select: typeof userSafeSelect;
}>;

export class UserMapper {
  static toResponse(user: Usuario): UserResponse {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      ativo: user.ativo,
      criadoEm: user.criadoEm,
      atualizadoEm: user.atualizadoEm,
    };
  }
}
