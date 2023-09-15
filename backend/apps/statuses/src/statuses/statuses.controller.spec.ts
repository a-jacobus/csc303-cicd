import { Test, TestingModule } from '@nestjs/testing';
import { StatusesController } from './statuses.controller';
import { StatusesService } from './statuses.service';

describe('StatusesController', () => {
  let statusesController: StatusesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StatusesController],
      providers: [StatusesService],
    }).compile();

    statusesController = app.get<StatusesController>(StatusesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(statusesController.getHello()).toBe('Hello World!');
    });
  });
});
