import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
jest.setTimeout(30000);

describe('Users E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

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

      expect(response.status).toBe(200);

      const profileBody = response.body as {
        email: string;
      };

      expect(profileBody.email).toBe(user.email);
    });

    it('deve falhar sem token JWT', async () => {
      const response = await request(app.getHttpServer()).get('/users/profile');

      expect(response.status).toBe(401);
    });
  });
});
