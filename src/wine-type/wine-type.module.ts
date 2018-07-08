import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WineTypeController } from './wine-type.controller';
import { WineType } from './wine-type.entity';
import { WineTypeService } from './wine-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([WineType])],
  controllers: [WineTypeController],
  providers: [WineTypeService],
})
export class WineTypeModule {
}
