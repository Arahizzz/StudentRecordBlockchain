import { Module } from '@nestjs/common';
import { ContractModule } from 'src/contract/contract.module';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';

@Module({
  imports: [ContractModule],
  controllers: [SubjectController],
  providers: [SubjectService]
})
export class SubjectModule {}
