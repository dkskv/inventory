import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './location.entity';
import { LocationService } from './location.service';
import { LocationResolver } from './location.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  providers: [LocationService, LocationResolver],
})
export class LocationModule {}
