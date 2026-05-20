import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Usuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
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
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Usuario> {
    this.logger.log(`Iniciando criação de usuário: ${createUserDto.email}`);

    // Valida se email é único
    await UserValidationUtil.ensureEmailIsUnique(
      this.prisma,
      createUserDto.email,
    );

    // Criptografa a senha usando bcrypt
    const saltRounds = Number(
      this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10),
    );
    const senhaCriptografada = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
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

    return newUser;
  }

  // Método de listagem com paginação e cache
  async findAll(page: number = 1, limit: number = 20) {
    this.logger.log(`Buscando usuários - Página: ${page}, Limite: ${limit}`);

    // A chave do cache dinamicamente inclui a página e o limite para diferenciar os resultados
    const cacheKey = `usuarios:page:${page}:limit:${limit}`;

    // Tenta recuperar do cache
    const cachedResult = await this.cacheService.get<any>(cacheKey);
    if (cachedResult) {
      this.logger.debug(`Retornando usuários do cache (Página ${page})`);
      return cachedResult;
    }

    // Calcula o offset (quantos registros pular no banco)
    const skip = (page - 1) * limit;

    // Busca os dados e o total de registros em paralelo para otimizar a performance
    const [users, total] = await this.prisma.$transaction([
      this.prisma.usuario.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
          ativo: true,
          criadoEm: true,
          atualizadoEm: true,
        },
      }),
      this.prisma.usuario.count(),
    ]);

    // Estrutura o retorno com os metadados da paginação
    const result = {
      data: users,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };

    this.logger.log(
      `Encontrados ${users.length} usuários na página ${page} (Total: ${total}).`,
    );

    // Armazena no cache por 60 segundos
    await this.cacheService.set(cacheKey, result, 60);

    return result;
  }

  // Método de busca por ID com cache
  async findOne(id: string): Promise<Usuario> {
    this.logger.log(`Buscando usuário ID: ${id}`);

    const cacheKey = `usuario:${id}`;

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
    const dataToUpdate: any = {};
    if (dto.nome) dataToUpdate.nome = dto.nome;
    if (dto.email) dataToUpdate.email = dto.email;
    if (dto.password) {
      const saltRounds = Number(
        this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10),
      );
      dataToUpdate.senha = await bcrypt.hash(dto.password, saltRounds);
    }

    // Atualiza no banco
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

  async findByEmail(email: string): Promise<Usuario | null> {
    this.logger.debug(`Buscando usuário por email: ${email}`);

    return await this.prisma.usuario.findUnique({
      where: { email },
    });
  }
}
