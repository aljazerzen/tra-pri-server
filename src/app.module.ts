import { Module } from '@nestjs/common';
import { PlaceModule } from './place/place.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WineModule } from './wine/wine.module';
import { WineTypeModule } from './wine-type/wine-type.module';
import { SugarModule } from './sugar/sugar.module';
import { WinemakerModule } from './winemaker/winemaker.module';
import { VarietyModule } from './variety/variety.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    PlaceModule,
    WineModule,
    WineTypeModule,
    SugarModule,
    WinemakerModule,
    VarietyModule,
    SugarModule,
  ],

})
export class AppModule {
}
