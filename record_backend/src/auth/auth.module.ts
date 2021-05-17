import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import jwtConstants from 'config/jwt.json';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { CaModule } from 'src/ca/ca.module';
import { RecordbookModule } from 'src/recordbook/recordbook.module';

@Module({
  imports: [
    CaModule,
    UserModule,
    PassportModule,
    RecordbookModule,
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
