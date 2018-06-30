import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileModule } from '../file/file.module';
import { WineModule } from '../wine/wine.module';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { TFModelController } from './tf-model/tf-model.controller';
import { TFModelService } from './tf-model/tf-model.service';
import { WinePackage } from './wine-package.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WinePackage]),
    WineModule,
    FileModule,
  ],
  providers: [
    PackageService,
    TFModelService,
  ],
  controllers: [
    PackageController,
    TFModelController,
  ]
})
export class PackageModule {
}
