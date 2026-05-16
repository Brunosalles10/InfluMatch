import { Injectable, Logger } from '@nestjs/common';
import { Usuario } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../redis/cache.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { HandlePostActionsUtil } from './utils/handlePostActions';
import { UserValidationUtil } from './utils/user-validation.utils';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    private readonly handlePostActionsUtil: HandlePostActionsUtil,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Usuario> {
    this.logger.log(`Iniciando criação de usuário: ${createUserDto.email}`);

    // Valida se email é único
    await UserValidationUtil.ensureEmailIsUnique(
      this.prisma,
      createUserDto.email,
    );

    // Cria o usuário no banco (middleware Prisma criptografa a senha automaticamente)
    const newUser = await this.prisma.usuario.create({
      data: {
        nome: createUserDto.nome,
        email: createUserDto.email,
        senha: createUserDto.password,
        role: 'USER',
      },
    });

    this.logger.log(`Novo usuário criado com sucesso: ${newUser.email}`);

    // Dispara ações pós-criação (cache + pub/sub)
    await this.handlePostActionsUtil.execute(newUser, 'created');

    return newUser;
  }

  async findAll(): Promise<Usuario[]> {
    this.logger.log('Buscando todos os usuários');

    const cacheKey = 'users:all';

    // Tenta recuperar do cache
    const cachedUsers = await this.cacheService.get<Usuario[]>(cacheKey);
    if (cachedUsers) {
      this.logger.debug(`Retornando ${cachedUsers.length} usuários do cache`);
      return cachedUsers;
    }

    // Busca do banco (sem senha)
    const users = await this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        criadoEm: true,
      },
    });

    this.logger.log(`Encontrados ${users.length} usuários no banco de dados.`);

    // Armazena no cache por 60 segundos
    await this.cacheService.set(cacheKey, users, 60);

    return users as any;
  }

  async findOne(id: string): Promise<Usuario> {
    this.logger.log(`Buscando usuário ID: ${id}`);

    const cacheKey = `user:${id}`;

    // Tenta recuperar do cache
    const cachedUser = await this.cacheService.get<Usuario>(cacheKey);
    if (cachedUser) {
      this.logger.debug(`Usuário ID ${id} retornado do cache`);
      return cachedUser;
    }

    // Busca no banco ou lança erro
    const user = await UserValidationUtil.findUserOrFail(this.prisma, id);

    // Armazena no cache por 60 segundos
    await this.cacheService.set(cacheKey, user, 60);

    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<Usuario> {
    this.logger.log(`Atualizando usuário ID: ${id}`);

    // Verifica se usuário existe
    const user = await UserValidationUtil.findUserOrFail(this.prisma, id);

    // Valida email único (se foi fornecido email novo)
    await UserValidationUtil.ensureEmailIsUnique(
      this.prisma,
      dto.email,
      id,
      user.email,
    );

    // Prepara dados para atualização
    const dataToUpdate = {
      ...(dto.name && { nome: dto.name }),
      ...(dto.email && { email: dto.email }),
      ...(dto.password && { senha: dto.password }),
    };

    // Atualiza no banco (middleware Prisma criptografa a senha se foi fornecida)
    const updatedUser = await this.prisma.usuario.update({
      where: { id },
      data: dataToUpdate,
    });

    this.logger.log(`Usuário ID ${id} atualizado com sucesso`);

    // Dispara ações pós-atualização
    await this.handlePostActionsUtil.execute(updatedUser, 'updated');

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removendo usuário ID: ${id}`);

    // Verifica se usuário existe
    await UserValidationUtil.findUserOrFail(this.prisma, id);

    // Deleta do banco
    await this.prisma.usuario.delete({
      where: { id },
    });

    this.logger.log(`Usuário ID ${id} removido.`);

    // Dispara ações pós-deleção (limpa cache + publica evento)
    await this.handlePostActionsUtil.execute({ id }, 'deleted');
  }

  async findByEmail(email: string): Promise<Usuario> {
    this.logger.debug(`Buscando usuário por email: ${email}`);

    return await this.prisma.usuario.findUnique({
      where: { email },
    });
  }
}
