import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from './../file/file.module';
import { VarietyController } from './variety.controller';
import { Variety } from './variety.entity';
import { VarietyService } from './variety.service';

@Module({
  modules: [
    TypeOrmModule.forFeature([Variety]),
    FileModule,
  ],
  controllers: [VarietyController],
  components: [VarietyService],
  exports: [VarietyService]
})
export class VarietyModule {
}
