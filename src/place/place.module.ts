import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileModule } from '../file/file.module';
import { PlaceController } from './place.controller';
import { Place } from './place.entity';
import { PlaceService } from './place.service';

@Module({
  imports: [TypeOrmModule.forFeature([Place]), FileModule],
  controllers: [PlaceController],
  providers: [PlaceService],
})
export class PlaceModule {
}
