import {
  BadRequestException,
  ForbiddenException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Usuario } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export class UserValidationUtil {
  private static readonly logger = new Logger(UserValidationUtil.name);

  /**
   * Busca um usuário pelo ID ou lança 404 quando ele não existe.
   */
  static async findUserOrFail(prisma: PrismaService, id: string) {
    this.logger.debug(`Verificando existência do usuário ID: ${id}`);

    const user = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!user) {
      this.logger.warn(`Usuário não encontrado: ID ${id}`);
      throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
    }

    this.logger.debug(`Usuário encontrado: ${user.email} (ID: ${user.id})`);
    return user;
  }

  /**
   * Garante que o e-mail informado não pertence a outro usuário.
   */
  static async ensureEmailIsUnique(
    prisma: PrismaService,
    newEmail?: string,
    userId?: string,
    currentEmail?: string,
  ): Promise<void> {
    if (!newEmail || newEmail === currentEmail) return;

    const existing = await prisma.usuario.findUnique({
      where: { email: newEmail },
    });

    if (existing && existing.id !== userId) {
      this.logger.warn(
        `E-mail já em uso por outro usuário (ID: ${existing.id}) → ${newEmail}`,
      );
      throw new BadRequestException('E-mail já está em uso.');
    }
  }

  /**
   * Impede operações de usuários que já estão inativos.
   */
  static ensureUserIsActive(user: Usuario): void {
    if (!user.ativo) {
      throw new ForbiddenException(
        'Usuário inativo não pode realizar esta ação.',
      );
    }
  }
}
