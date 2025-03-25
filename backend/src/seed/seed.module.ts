import { Module, OnModuleInit } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/entities/user/user.module';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from 'shared/env-validation';

@Module({
  imports: [AuthModule, UserModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule implements OnModuleInit {
  constructor(
    private readonly seedService: SeedService,
    private readonly configService: ConfigService<EnvVariables, true>,
  ) {}

  async onModuleInit() {
    await this.seedService.seedAdminUser(
      this.configService.get('SEED_USER_USERNAME'),
      this.configService.get('SEED_USER_PASSWORD'),
    );
  }
}
