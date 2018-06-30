import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlaceController } from './place.controller';
import { Place } from './place.entity';
import { PlaceService } from './place.service';

@Module({
  imports: [TypeOrmModule.forFeature([Place])],
  controllers: [PlaceController],
  providers: [PlaceService],
})
export class PlaceModule {
}
