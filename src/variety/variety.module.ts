import { Module } from '@nestjs/common';
import { VarietyController } from './variety.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variety } from './variety.entity';
import { VarietyService } from './variety.service';

@Module({
  modules: [TypeOrmModule.forFeature([Variety])],
  controllers: [VarietyController],
  components: [VarietyService],
})
export class VarietyModule {
}
