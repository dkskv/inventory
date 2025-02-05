import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../entities/user/user.module';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from 'shared/env-validation';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { AccessControlModule } from 'src/access-control/access-control.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvVariables, true>) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
    AccessControlModule,
  ],
  providers: [JwtStrategy, AuthService, AuthResolver],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
