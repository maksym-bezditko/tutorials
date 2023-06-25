import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let testProductId: string;
  let createdId: string;

  let testCreateReviewDto: CreateReviewDto;

  beforeAll(() => {
    testProductId = new Types.ObjectId().toHexString();

    testCreateReviewDto = {
      name: 'test name',
      productId: testProductId,
      rating: 5,
      title: 'test title',
      description: 'test description',
    };
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/review/create (POST)', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
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
      .delete('/review/delete/' + createdId)
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

  afterAll(() => {
    disconnect();
  });
});
