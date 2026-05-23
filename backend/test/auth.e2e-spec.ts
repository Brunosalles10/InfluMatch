import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth E2E', () => {
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

  describe('POST /auth/login', () => {
    it('deve falhar com credenciais inválidas', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'fake@test.com',
          password: 'Senha@123',
        });

      expect(response.status).toBe(401);
    });

    it('deve falhar com email inválido', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'abc',
          password: '123',
        });

      expect(response.status).toBe(401);
    });

    it('deve realizar login com sucesso', async () => {
      const user = {
        nome: 'Mariana',
        email: 'mariana@test.com',
        password: 'Senha@123',
      };

      await request(app.getHttpServer()).post('/users').send(user);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      expect(response.status).toBe(201);
      expect(response.body.access_token).toBeDefined();
    });
  });
});
