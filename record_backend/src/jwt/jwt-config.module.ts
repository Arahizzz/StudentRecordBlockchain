import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import jwtConstants from 'config/jwt.json';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule, JwtStrategy],
})
export class JwtConfigModule {}
