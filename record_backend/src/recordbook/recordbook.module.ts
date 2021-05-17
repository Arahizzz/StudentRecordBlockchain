import { Module } from '@nestjs/common';
import { RecordbookService } from './recordbook.service';
import { RecordbookController } from './recordbook.controller';
import { UserModule } from 'src/user/user.module';
import { ContractModule } from 'src/contract/contract.module';

@Module({
  imports: [ContractModule, UserModule],
  providers: [RecordbookService],
  controllers: [RecordbookController],
  exports: [RecordbookService]
})
export class RecordbookModule {}
