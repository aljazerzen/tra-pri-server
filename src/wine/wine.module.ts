import { Module } from '@nestjs/common';
import { WineController } from './wine.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wine } from './wine.entity';
import { WineService } from './wine.service';

@Module({
  modules: [TypeOrmModule.forFeature([Wine])],
  controllers: [WineController],
  components: [WineService],
})
export class WineModule {
}
