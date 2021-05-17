import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CaModule } from './ca/ca.module';
import { RecordbookModule } from './recordbook/recordbook.module';
import { JwtConfigModule } from './jwt/jwt-config.module';
import { SubjectModule } from './subject/subject.module';
import { ContractModule } from './contract/contract.module';
import { FabricExceptionFilter } from './fabric-exception.filter';
import { APP_FILTER } from '@nestjs/core';
@Module({
  imports: [
    AuthModule,
    UserModule,
    CaModule,
    RecordbookModule,
    JwtConfigModule,
    SubjectModule,
    ContractModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: FabricExceptionFilter,
    },
  ],
})
export class AppModule {}
