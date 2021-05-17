import { Test, TestingModule } from '@nestjs/testing';
import { RecordbookController } from './recordbook.controller';

describe('RecordbookController', () => {
  let controller: RecordbookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordbookController],
    }).compile();

    controller = module.get<RecordbookController>(RecordbookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
