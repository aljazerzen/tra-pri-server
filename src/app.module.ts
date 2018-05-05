import { Module } from '@nestjs/common';
import { PlaceModule } from './place/place.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    PlaceModule,
  ],

})
export class AppModule {
}
