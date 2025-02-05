import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/entities/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
