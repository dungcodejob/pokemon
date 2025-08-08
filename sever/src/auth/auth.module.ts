import { AccountModule } from '@app/account';
import { jwtConfig } from '@app/configs';
import { UserModule } from '@app/user';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptService } from './services';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule,
    AccountModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, BcryptService],
  exports: [AuthService],
})
export class AuthModule {}
