import { FileModule } from './../file/file.module';
import { Module } from '@nestjs/common';
import { WineController } from './wine.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wine } from './wine.entity';
import { WineService } from './wine.service';
import { VarietyModule } from '../variety/variety.module';

@Module({
  modules: [
    TypeOrmModule.forFeature([Wine]), VarietyModule,
    FileModule,
  ],
  controllers: [WineController],
  components: [WineService],
  exports: [WineService]
})
export class WineModule {
}
