import { Test, TestingModule } from '@nestjs/testing';
import { RecordbookService } from './recordbook.service';

describe('RecordbookService', () => {
  let service: RecordbookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordbookService],
    }).compile();

    service = module.get<RecordbookService>(RecordbookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
