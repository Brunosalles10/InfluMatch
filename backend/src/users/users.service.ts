import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, Usuario } from '@prisma/client';
import { AuthUser } from 'src/auth/interface/auth-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CacheService } from '../redis/cache.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import {
  UserMapper,
  UserResponse,
  userSafeSelect,
} from './mappers/user.mapper';
import { UserPasswordService } from './services/user-password.service';
import { HandlePostActionsUtil } from './utils/handlePostActions';
import { UserValidationUtil } from './utils/user-validation.utils';

export interface PaginatedUsersResponse {
  data: UserResponse[];
  total: number;
  page: number;
  lastPage: number;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    private readonly handlePostActionsUtil: HandlePostActionsUtil,
    private readonly userPasswordService: UserPasswordService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    this.logger.log(`Iniciando criação de usuário: ${createUserDto.email}`);

    await UserValidationUtil.ensureEmailIsUnique(
      this.prisma,
      createUserDto.email,
    );

    const senhaCriptografada = await this.userPasswordService.hash(
      createUserDto.password,
    );

    const newUser = await this.prisma.usuario.create({
      data: {
        nome: createUserDto.nome,
        email: createUserDto.email,
        senha: senhaCriptografada,
        role: 'USER',
      },
    });

    this.logger.log(`Novo usuário criado com sucesso: ${newUser.email}`);

    await this.handlePostActionsUtil.execute(newUser, 'created');

    return UserMapper.toResponse(newUser);
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedUsersResponse> {
    this.logger.log(`Buscando usuários - Página: ${page}, Limite: ${limit}`);

    const cacheKey = `usuarios:page:${page}:limit:${limit}`;

    const cachedResult =
      await this.cacheService.get<PaginatedUsersResponse>(cacheKey);

    if (cachedResult) {
      this.logger.debug(`Retornando usuários do cache (Página ${page})`);
      return cachedResult;
    }

    const skip = (page - 1) * limit;

    const [users, total] = await this.prisma.$transaction([
      this.prisma.usuario.findMany({
        skip,
        take: limit,
        select: userSafeSelect,
      }),
      this.prisma.usuario.count(),
    ]);

    const result: PaginatedUsersResponse = {
      data: users,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };

    this.logger.log(
      `Encontrados ${users.length} usuários na página ${page} (Total: ${total}).`,
    );

    await this.cacheService.set(cacheKey, result, 60);

    return result;
  }

  async findOne(id: string): Promise<UserResponse> {
    this.logger.log(`Buscando usuário ID: ${id}`);

    const cacheKey = `usuario:${id}`;

    const cachedUser = await this.cacheService.get<UserResponse>(cacheKey);

    if (cachedUser) {
      this.logger.debug(`Usuário ID ${id} retornado do cache`);
      return cachedUser;
    }

    const user = await UserValidationUtil.findUserOrFail(this.prisma, id);

    const userResponse = UserMapper.toResponse(user);

    await this.cacheService.set(cacheKey, userResponse, 60);

    return userResponse;
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    currentUser: AuthUser,
  ): Promise<UserResponse> {
    this.logger.log(`Atualizando usuário ID: ${id}`);

    if (currentUser.role !== 'ADMIN' && currentUser.sub !== id) {
      this.logger.warn(
        `Violação de acesso: Usuário ${currentUser.sub} tentou alterar o usuário ${id}`,
      );

      throw new ForbiddenException(
        'Você só tem permissão para alterar o seu próprio perfil.',
      );
    }

    const user = await UserValidationUtil.findUserOrFail(this.prisma, id);

    await UserValidationUtil.ensureEmailIsUnique(
      this.prisma,
      dto.email,
      id,
      user.email,
    );

    const dataToUpdate: Prisma.UsuarioUpdateInput = {};

    if (dto.nome !== undefined) {
      dataToUpdate.nome = dto.nome;
    }

    if (dto.email !== undefined) {
      dataToUpdate.email = dto.email;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new BadRequestException(
        'Informe ao menos um campo para atualização.',
      );
    }

    const updatedUser = await this.prisma.usuario.update({
      where: { id },
      data: dataToUpdate,
    });

    this.logger.log(`Usuário ID ${id} atualizado com sucesso`);

    await this.handlePostActionsUtil.execute(updatedUser, 'updated');

    return UserMapper.toResponse(updatedUser);
  }

  async updateOwnPassword(
    userId: string,
    dto: UpdatePasswordDto,
  ): Promise<void> {
    this.logger.log(`Atualizando senha do usuário ID: ${userId}`);

    const user = await UserValidationUtil.findUserOrFail(this.prisma, userId);

    UserValidationUtil.ensureUserIsActive(user);

    const currentPasswordIsValid = await this.userPasswordService.compare(
      dto.currentPassword,
      user.senha,
    );

    if (!currentPasswordIsValid) {
      throw new UnauthorizedException('Senha atual inválida.');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'A nova senha deve ser diferente da senha atual.',
      );
    }

    const senhaCriptografada = await this.userPasswordService.hash(
      dto.newPassword,
    );

    const updatedUser = await this.prisma.usuario.update({
      where: { id: userId },
      data: {
        senha: senhaCriptografada,
      },
    });

    this.logger.log(`Senha do usuário ID ${userId} atualizada com sucesso`);

    await this.handlePostActionsUtil.execute(updatedUser, 'updated');
  }

  async removeOwnAccount(userId: string): Promise<void> {
    this.logger.log(`Usuário ID ${userId} solicitou exclusão da própria conta`);

    const user = await UserValidationUtil.findUserOrFail(this.prisma, userId);

    UserValidationUtil.ensureUserIsActive(user);

    await this.deactivateUser(user.id);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removendo usuário ID: ${id}`);

    await UserValidationUtil.findUserOrFail(this.prisma, id);

    await this.deactivateUser(id);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    this.logger.debug(`Buscando usuário por email: ${email}`);

    return await this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  private async deactivateUser(id: string): Promise<void> {
    await this.prisma.usuario.update({
      where: { id },
      data: { ativo: false },
    });

    this.logger.log(`Usuário ID ${id} marcado como inativo.`);

    await this.handlePostActionsUtil.execute({ id }, 'deleted');
  }
}
