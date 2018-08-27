import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileModule } from '../file/file.module';
import { WineTypeController } from './wine-type.controller';
import { WineType } from './wine-type.entity';
import { WineTypeService } from './wine-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([WineType]), FileModule],
  controllers: [WineTypeController],
  providers: [WineTypeService],
})
export class WineTypeModule {
}
