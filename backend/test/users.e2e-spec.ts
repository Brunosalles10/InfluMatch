import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Users E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('deve criar usuário com sucesso', async () => {
      const uniqueEmail = `joao${Date.now()}@test.com`;

      const response = await request(app.getHttpServer()).post('/users').send({
        nome: 'João',
        email: uniqueEmail,
        password: 'Senha@123',
      });

      expect(response.status).toBe(201);
    });

    it('deve falhar com email inválido', async () => {
      const response = await request(app.getHttpServer()).post('/users').send({
        nome: 'João',
        email: 'abc',
        password: 'Senha@123',
      });

      expect(response.status).toBe(400);
    });

    it('deve falhar com senha fraca', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          nome: 'João',
          email: `teste${Date.now()}@test.com`,
          password: '123',
        });

      expect(response.status).toBe(400);
    });

    it('deve falhar com nome vazio', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          nome: '',
          email: `teste${Date.now()}@test.com`,
          password: 'Senha@123',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /users/profile', () => {
    it('deve retornar perfil do usuário autenticado', async () => {
      const uniqueEmail = `maria${Date.now()}@test.com`;

      const user = {
        nome: 'Maria',
        email: uniqueEmail,
        password: 'Senha@123',
      };

      await request(app.getHttpServer()).post('/users').send(user);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      const loginBody = loginResponse.body as {
        access_token: string;
      };

      const token = loginBody.access_token;

      const response = await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      const profileBody = response.body as {
        email: string;
      };

      expect(profileBody.email).toBe(user.email);
    });

    it('deve falhar sem token', async () => {
      const response = await request(app.getHttpServer()).get('/users/profile');

      expect(response.status).toBe(401);
    });

    it('deve falhar com token inválido', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', 'Bearer token-invalido');

      expect(response.status).toBe(401);
    });
  });
});
