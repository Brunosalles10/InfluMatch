import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export class UserValidationUtil {
  private static readonly logger = new Logger(UserValidationUtil.name);

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

  static async ensureEmailIsUnique(
    prisma: PrismaService,
    newEmail?: string,
    userId?: string,
    currentEmail?: string,
  ): Promise<void> {
    // Se não forneceu email novo ou é igual ao atual, não valida
    if (!newEmail || newEmail === currentEmail) return;

    const existing = await prisma.usuario.findUnique({
      where: { email: newEmail },
    });

    // Se existe outro usuário com esse email, nega
    if (existing && existing.id !== userId) {
      this.logger.warn(
        `E-mail já em uso por outro usuário (ID: ${existing.id}) → ${newEmail}`,
      );
      throw new BadRequestException('E-mail já está em uso.');
    }
  }

  static handlePrismaError(error: any): never {
    const isUniqueConstraintError =
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002';

    if (isUniqueConstraintError) {
      this.logger.error(`Erro de unicidade detectado: Campo duplicado`);
      throw new BadRequestException('E-mail já cadastrado.');
    }

    this.logger.error(`Erro inesperado: ${error.message}`, error.stack);
    throw error;
  }
}
