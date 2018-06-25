import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VarietyModule } from '../variety/variety.module';
import { FileModule } from './../file/file.module';
import { WineController } from './wine.controller';
import { Wine } from './wine.entity';
import { WineService } from './wine.service';
import { Label } from './label.entity';
import { LabelController } from './label.controller';

@Module({
  modules: [
    TypeOrmModule.forFeature([Wine, Label]),
    VarietyModule,
    FileModule,
  ],
  controllers: [WineController, LabelController],
  components: [WineService],
  exports: [WineService]
})
export class WineModule {
}
