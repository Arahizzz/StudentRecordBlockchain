import { Test, TestingModule } from '@nestjs/testing';
import { CAService } from './ca.service';

describe('CAService', () => {
  let service: CAService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CAService],
    }).compile();

    service = module.get<CAService>(CAService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
