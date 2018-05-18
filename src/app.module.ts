import { Module } from '@nestjs/common';
import { PlaceModule } from './place/place.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WineModule } from './wine/wine.module';
import { WineTypeModule } from './wine-type/wine-type.module';
import { SugarModule } from './sugar/sugar.module';
import { WinemakerModule } from './winemaker/winemaker.module';
import { VarietyModule } from './variety/variety.module';
import { AuthController } from './auth/auth.controller';
import { FileModule } from './file/file.module';
import { PackageModule } from './package/package.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    FileModule,
    PlaceModule,
    WineModule,
    WineTypeModule,
    SugarModule,
    WinemakerModule,
    VarietyModule,
    PackageModule,
  ],
  controllers: [
    AuthController
  ]

})
export class AppModule {
}
