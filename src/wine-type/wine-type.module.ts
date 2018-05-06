import { Module } from '@nestjs/common';
import { WineTypeController } from './wine-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WineType } from './wine-type.entity';
import { WineTypeService } from './wine-type.service';

@Module({
  modules: [TypeOrmModule.forFeature([WineType])],
  controllers: [WineTypeController],
  components: [WineTypeService],
})
export class WineTypeModule {
}
