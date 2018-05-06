import { Module } from '@nestjs/common';
import { PlaceModule } from './place/place.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WineModule } from './wine/wine.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    PlaceModule,
    WineModule,
  ],

})
export class AppModule {
}
