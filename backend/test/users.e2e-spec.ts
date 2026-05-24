import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

jest.setTimeout(30000);

describe('Users E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    prisma = app.get(PrismaService);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  async function createAdminAndLogin() {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const admin = await prisma.usuario.create({
      data: {
        nome: 'Administrador',
        email: `admin${Date.now()}@email.com`,
        senha: hashedPassword,
        role: 'ADMIN',
      },
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: admin.email,
        password: 'Admin@123',
      });

    const body = loginResponse.body as {
      access_token: string;
    };

    return body.access_token;
  }

  describe('POST /users', () => {
    it('deve criar usuário com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          nome: 'Usuário Teste',
          email: `teste${Date.now()}@email.com`,
          password: 'Senha@123',
        });

      expect(response.status).toBe(201);
    });

    it('deve falhar com email inválido', async () => {
      const response = await request(app.getHttpServer()).post('/users').send({
        nome: 'Usuário Teste',
        email: 'email-invalido',
        password: 'Senha@123',
      });

      expect(response.status).toBe(400);
    });

    it('deve falhar com senha fraca', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          nome: 'Usuário Teste',
          email: `teste${Date.now()}@email.com`,
          password: '123',
        });

      expect(response.status).toBe(400);
    });

    it('deve falhar com nome vazio', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          nome: '',
          email: `teste${Date.now()}@email.com`,
          password: 'Senha@123',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /users/profile', () => {
    it('deve retornar perfil do usuário autenticado', async () => {
      const user = {
        nome: 'Usuário Perfil',
        email: `perfil${Date.now()}@email.com`,
        password: 'Senha@123',
      };

      await request(app.getHttpServer()).post('/users').send(user);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      const body = loginResponse.body as {
        access_token: string;
      };

      const token = body.access_token;

      const response = await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${token}`);

      const profileBody = response.body as {
        email: string;
      };

      expect(response.status).toBe(200);
      expect(profileBody.email).toBe(user.email);
    });

    it('deve falhar sem token JWT', async () => {
      const response = await request(app.getHttpServer()).get('/users/profile');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /users', () => {
    it('deve permitir ADMIN listar usuários', async () => {
      const token = await createAdminAndLogin();

      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`);

      const body = response.body as {
        data: unknown[];
      };

      expect(response.status).toBe(200);
      expect(Array.isArray(body.data)).toBe(true);
    });

    it('deve falhar sem token JWT', async () => {
      const response = await request(app.getHttpServer()).get('/users');

      expect(response.status).toBe(401);
    });

    it('deve impedir USER comum de listar usuários', async () => {
      const user = {
        nome: 'Usuário comum',
        email: `user${Date.now()}@email.com`,
        password: 'User@123',
      };

      await request(app.getHttpServer()).post('/users').send(user);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      const body = loginResponse.body as {
        access_token: string;
      };

      const token = body.access_token;

      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    describe('GET /users/:id', () => {
      it('deve permitir ADMIN buscar usuário por ID', async () => {
        const token = await createAdminAndLogin();

        const user = {
          nome: 'Usuário Busca',
          email: `busca${Date.now()}@email.com`,
          password: 'User@123',
        };

        const createResponse = await request(app.getHttpServer())
          .post('/users')
          .send(user);

        const createdUser = createResponse.body as {
          id: string;
          email: string;
        };

        const response = await request(app.getHttpServer())
          .get(`/users/${createdUser.id}`)
          .set('Authorization', `Bearer ${token}`);

        const body = response.body as {
          email: string;
        };

        expect(response.status).toBe(200);
        expect(body.email).toBe(user.email);
      });

      it('deve falhar sem token JWT', async () => {
        const response = await request(app.getHttpServer()).get(
          '/users/id-fake',
        );

        expect(response.status).toBe(401);
      });

      it('deve impedir USER comum de buscar usuário por ID', async () => {
        const user = {
          nome: 'Usuário comum',
          email: `common${Date.now()}@email.com`,
          password: 'User@123',
        };

        const createResponse = await request(app.getHttpServer())
          .post('/users')
          .send(user);

        const createdUser = createResponse.body as {
          id: string;
        };

        const loginResponse = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: user.email,
            password: user.password,
          });

        const loginBody = loginResponse.body as {
          access_token: string;
        };

        const response = await request(app.getHttpServer())
          .get(`/users/${createdUser.id}`)
          .set('Authorization', `Bearer ${loginBody.access_token}`);

        expect(response.status).toBe(403);
      });

      it('deve falhar com ID inválido', async () => {
        const token = await createAdminAndLogin();

        const response = await request(app.getHttpServer())
          .get('/users/id-invalido')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
      });

      it('deve falhar ao buscar usuário inexistente', async () => {
        const token = await createAdminAndLogin();

        const response = await request(app.getHttpServer())
          .get('/users/11111111-1111-1111-1111-111111111111')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
      });
    });
  });

  describe('PATCH /users/:id', () => {
    it('deve permitir usuário atualizar próprio perfil', async () => {
      const user = {
        nome: 'Usuário Update',
        email: `update${Date.now()}@email.com`,
        password: 'User@123',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(user);

      const createdUser = createResponse.body as {
        id: string;
      };

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      const loginBody = loginResponse.body as {
        access_token: string;
      };

      const response = await request(app.getHttpServer())
        .patch(`/users/${createdUser.id}`)
        .set('Authorization', `Bearer ${loginBody.access_token}`)
        .send({
          nome: 'Nome Atualizado',
        });

      const body = response.body as {
        nome: string;
      };

      expect(response.status).toBe(200);
      expect(body.nome).toBe('Nome Atualizado');
    });

    it('deve permitir ADMIN atualizar qualquer usuário', async () => {
      const token = await createAdminAndLogin();

      const user = {
        nome: 'Usuário Comum',
        email: `common${Date.now()}@email.com`,
        password: 'User@123',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(user);

      const createdUser = createResponse.body as {
        id: string;
      };

      const response = await request(app.getHttpServer())
        .patch(`/users/${createdUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Atualizado pelo Admin',
        });

      expect(response.status).toBe(200);

      const body = response.body as {
        nome: string;
      };

      expect(body.nome).toBe('Atualizado pelo Admin');
    });

    it('deve falhar ao atualizar com email já existente', async () => {
      const user1 = {
        nome: 'User 1',
        email: `dup1${Date.now()}@email.com`,
        password: 'User@123',
      };

      const user2 = {
        nome: 'User 2',
        email: `dup2${Date.now()}@email.com`,
        password: 'User@123',
      };

      await request(app.getHttpServer()).post('/users').send(user1);

      const createUser2 = await request(app.getHttpServer())
        .post('/users')
        .send(user2);

      const user2Body = createUser2.body as {
        id: string;
      };

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user2.email,
          password: user2.password,
        });

      const loginBody = loginResponse.body as {
        access_token: string;
      };

      const response = await request(app.getHttpServer())
        .patch(`/users/${user2Body.id}`)
        .set('Authorization', `Bearer ${loginBody.access_token}`)
        .send({
          email: user1.email,
        });

      expect(response.status).toBe(400);
    });

    it('deve falhar com ID inválido', async () => {
      const token = await createAdminAndLogin();

      const response = await request(app.getHttpServer())
        .patch('/users/id-invalido')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Teste',
        });

      expect(response.status).toBe(400);
    });

    it('deve impedir usuário de atualizar outro usuário', async () => {
      const user1 = {
        nome: 'User 1',
        email: `user1${Date.now()}@email.com`,
        password: 'User@123',
      };

      const user2 = {
        nome: 'User 2',
        email: `user2${Date.now()}@email.com`,
        password: 'User@123',
      };

      await request(app.getHttpServer()).post('/users').send(user1);

      const createUser2 = await request(app.getHttpServer())
        .post('/users')
        .send(user2);

      const user2Body = createUser2.body as {
        id: string;
      };

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user1.email,
          password: user1.password,
        });

      const loginBody = loginResponse.body as {
        access_token: string;
      };

      const response = await request(app.getHttpServer())
        .patch(`/users/${user2Body.id}`)
        .set('Authorization', `Bearer ${loginBody.access_token}`)
        .send({
          nome: 'Hackeado',
        });

      expect(response.status).toBe(403);
    });

    it('deve falhar sem token JWT', async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/id-fake')
        .send({
          nome: 'Teste',
        });

      expect(response.status).toBe(401);
    });

    describe('DELETE /users/:id', () => {
      it('deve permitir ADMIN deletar usuário', async () => {
        const token = await createAdminAndLogin();

        const user = {
          nome: 'Usuário Delete',
          email: `delete${Date.now()}@email.com`,
          password: 'User@123',
        };

        const createResponse = await request(app.getHttpServer())
          .post('/users')
          .send(user);

        const createdUser = createResponse.body as {
          id: string;
        };

        const response = await request(app.getHttpServer())
          .delete(`/users/${createdUser.id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
      });

      it('deve impedir USER comum de deletar usuário', async () => {
        const user = {
          nome: 'Usuário comum',
          email: `common${Date.now()}@email.com`,
          password: 'User@123',
        };

        const createResponse = await request(app.getHttpServer())
          .post('/users')
          .send(user);

        const createdUser = createResponse.body as {
          id: string;
        };

        const loginResponse = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: user.email,
            password: user.password,
          });

        const loginBody = loginResponse.body as {
          access_token: string;
        };

        const response = await request(app.getHttpServer())
          .delete(`/users/${createdUser.id}`)
          .set('Authorization', `Bearer ${loginBody.access_token}`);

        expect(response.status).toBe(403);
      });

      it('deve falhar sem token JWT', async () => {
        const response = await request(app.getHttpServer()).delete(
          '/users/id-fake',
        );

        expect(response.status).toBe(401);
      });

      it('deve falhar com ID inválido', async () => {
        const token = await createAdminAndLogin();

        const response = await request(app.getHttpServer())
          .delete('/users/id-invalido')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
      });

      it('deve falhar ao deletar usuário inexistente', async () => {
        const token = await createAdminAndLogin();

        const response = await request(app.getHttpServer())
          .delete('/users/11111111-1111-1111-1111-111111111111')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
      });
    });
  });

  describe('DELETE /users/:id', () => {
    it('deve permitir ADMIN deletar usuário', async () => {
      const token = await createAdminAndLogin();

      const user = {
        nome: 'Usuário Delete',
        email: `delete${Date.now()}@email.com`,
        password: 'User@123',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(user);

      const createdUser = createResponse.body as {
        id: string;
      };

      const response = await request(app.getHttpServer())
        .delete(`/users/${createdUser.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });

    it('deve impedir USER comum de deletar usuário', async () => {
      const user1 = {
        nome: 'User 1',
        email: `user1${Date.now()}@email.com`,
        password: 'User@123',
      };

      const user2 = {
        nome: 'User 2',
        email: `user2${Date.now()}@email.com`,
        password: 'User@123',
      };

      await request(app.getHttpServer()).post('/users').send(user1);

      const createUser2 = await request(app.getHttpServer())
        .post('/users')
        .send(user2);

      const user2Body = createUser2.body as {
        id: string;
      };

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user1.email,
          password: user1.password,
        });

      const loginBody = loginResponse.body as {
        access_token: string;
      };

      const response = await request(app.getHttpServer())
        .delete(`/users/${user2Body.id}`)
        .set('Authorization', `Bearer ${loginBody.access_token}`);

      expect(response.status).toBe(403);
    });

    it('deve falhar sem token JWT', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/users/id-fake',
      );

      expect(response.status).toBe(401);
    });

    it('deve falhar com ID inválido', async () => {
      const token = await createAdminAndLogin();

      const response = await request(app.getHttpServer())
        .delete('/users/id-invalido')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });
});
