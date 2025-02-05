import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from 'shared/env-validation';
import { User } from 'src/entities/user/user.entity';
import { UserService } from 'src/entities/user/user.service';
import { JwtPayload } from './jwt.strategy';
import { z } from 'zod';

@Injectable()
export class AuthService {
  static getJwtPayload(user: Pick<User, 'id' | 'username'>): JwtPayload {
    return { sub: user.id, username: user.username };
  }

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvVariables, true>,
  ) {}

  async authenticateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findByUsernameOrFail(username);

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async generateTokens(payload: JwtPayload) {
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get('ACCESS_TOKEN_TTL'),
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get('REFRESH_TOKEN_TTL'),
      }),
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const { username, sub }: JwtPayload = this.jwtService.verify(
        refreshToken,
        {
          secret: this.configService.get('JWT_SECRET'),
        },
      );

      // todo: контролировать число активных сессий
      // const user = await this.userService.findById(payload.sub);

      // if (!user || user.refreshToken !== refreshToken) {
      //   throw new UnauthorizedException('Invalid refresh token');
      // }

      return this.generateTokens({ username, sub });
    } catch (_error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  validatePassword(password: string) {
    const scheme = z
      .string()
      .min(8)
      .regex(/[A-ZА-ЯЁ]/)
      .regex(/[a-zа-яё]/)
      .regex(/\d/)
      .regex(/[@$!%*?&]/);

    return scheme.parse(password);
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
