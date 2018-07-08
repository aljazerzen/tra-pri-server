import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VarietyModule } from '../variety/variety.module';
import { FileModule } from './../file/file.module';
import { LabelController } from './label.controller';
import { Label } from './label.entity';
import { WineController } from './wine.controller';
import { Wine } from './wine.entity';
import { WineService } from './wine.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wine, Label]),
    VarietyModule,
    FileModule,
  ],
  controllers: [WineController, LabelController],
  providers: [WineService],
  exports: [WineService]
})
export class WineModule {
}
