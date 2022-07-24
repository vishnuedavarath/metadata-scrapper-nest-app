import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  const req: any = {
    query: {},
    method: 'method',
    path: 'path',
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            scrapeUrl: jest.fn().mockResolvedValue({
              title: 'title',
              description: 'description',
              images: ['url1', 'url2'],
            }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return metadata', async () => {
      expect(await appController.scrapUrl({ url: 'url' }, req)).toStrictEqual({
        title: 'title',
        description: 'description',
        images: ['url1', 'url2'],
      });
    });
  });
});
