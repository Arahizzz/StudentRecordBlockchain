import { Module } from '@nestjs/common';
import { CAService } from './ca.service';

@Module({
    providers: [CAService],
    exports: [CAService]
})
export class CaModule {}
