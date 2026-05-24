import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
jest.setTimeout(30000);

describe('Auth E2E', () => {
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

  describe('POST /auth/login', () => {
    it('deve falhar com credenciais inválidas', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'teste@email.com',
          password: '12345678',
        });

      expect(response.status).toBe(401);
    });

    it('deve falhar com email inválido', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'email-invalido',
          password: '12345678',
        });

      expect(response.status).toBe(401);
    });

    it('deve realizar login com sucesso', async () => {
      const user = {
        nome: 'Usuário Login',
        email: `login${Date.now()}@email.com`,
        password: 'Senha@123',
      };

      await request(app.getHttpServer()).post('/users').send(user);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      expect(loginResponse.status).toBe(201);

      const body = loginResponse.body as {
        access_token: string;
      };

      expect(body.access_token).toBeDefined();
    });
  });
});
