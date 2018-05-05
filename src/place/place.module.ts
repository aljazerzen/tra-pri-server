import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './place.entity';
import { PlaceService } from './place.service';

@Module({
  modules: [TypeOrmModule.forFeature([Place])],
  controllers: [PlaceController],
  components: [PlaceService],
})
export class PlaceModule {
}
