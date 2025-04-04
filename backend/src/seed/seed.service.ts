import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessRole } from 'src/access-control/access-control.const';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/entities/user/user.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async seedAdminUser(username: string, password: string) {
    const existingAdmin = await this.userService.hasUserWithRole(
      AccessRole.ADMIN,
    );

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    if (this.configService.get('NODE_ENV') === 'production') {
      this.authService.validatePassword(password);
    }

    const passwordHash = await this.authService.hashPassword(password);

    try {
      await this.userService.create({
        username,
        passwordHash,
        accessRole: AccessRole.ADMIN,
      });
      console.log('Admin user created');
    } catch (e) {
      console.error('Error creating admin user', e);
    }
  }
}
