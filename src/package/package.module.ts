import { Module } from '@nestjs/common';
import { WineModule } from '../wine/wine.module';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { FileModule } from '../file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinePackage } from './wine-package.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WinePackage]),
    WineModule,
    FileModule,
  ],
  components: [
    PackageService,
  ],
  controllers: [
    PackageController
  ]
})
export class PackageModule {
}
