import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Responsible } from './responsible.entity';
import { ResponsibleService } from './responsible.service';
import { ResponsibleResolver } from './responsible.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Responsible])],
  providers: [ResponsibleService, ResponsibleResolver],
})
export class ResponsibleModule {}
