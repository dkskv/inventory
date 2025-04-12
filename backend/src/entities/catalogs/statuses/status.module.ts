import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './status.entity';
import { StatusService } from './status.service';
import { StatusResolver } from './status.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  providers: [StatusService, StatusResolver],
})
export class StatusModule {}
