import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { randomBytes } from 'crypto';

// generating random credentials to avoid interference with real user accounts
const testUserCredentials: AuthDto = {
  login: new Types.ObjectId().toHexString() + '@gmail.com',
  password: new Types.ObjectId().toHexString(),
};

const testProductId: string = new Types.ObjectId().toHexString();

const testCreateReviewDto: CreateReviewDto = {
  name: 'test name',
  productId: testProductId,
  rating: 5,
  title: 'test title',
  description: 'test description',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let createdId: string;

  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    console.log(randomBytes(128).toString('hex').toUpperCase());

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUserCredentials)
      .expect(201);

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(testUserCredentials)
      .expect(200);

    accessToken = body.access_token;
  });

  it('/review/create (POST) - fail', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testCreateReviewDto, rating: 6 })
      .set({
        Authorization: 'Bearer ' + accessToken,
      })
      .expect(400)
      .then(({ body }: request.Response) => {
        expect(body).toHaveProperty('message');
        expect(body.message.length).toBe(1);
      });
  });

  it('/review/create (POST)', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .set({
        Authorization: 'Bearer ' + accessToken,
      })
      .send(testCreateReviewDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;

        expect(body).toHaveProperty('_id');
        expect(body).toHaveProperty('createdAt');
        expect(body).toHaveProperty('updatedAt');
        expect(body.name).toBe(testCreateReviewDto.name);
      });
  });

  it('/review/byProduct/:productId (GET) - success', async () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + testProductId)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
      });
  });

  it('/review/delete/:id (DELETE) - success', async () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set({
        Authorization: 'Bearer ' + accessToken,
      })
      .expect(200);
  });

  it('/review/byProduct/:productId (GET) - fail', async () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + testProductId)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
      });
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete('/auth/deleteAccount')
      .set({
        Authorization: 'Bearer ' + accessToken,
      })
      .expect(200);
    disconnect();
  });
});
