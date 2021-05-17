import { Module } from '@nestjs/common';
import { CaModule } from 'src/ca/ca.module';
import { ContractService } from './contract.service';

@Module({
  imports: [CaModule],
  providers: [ContractService],
  exports: [ContractService]
})
export class ContractModule {}
