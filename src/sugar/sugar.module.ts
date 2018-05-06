import { Module } from '@nestjs/common';
import { SugarController } from './sugar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sugar } from './sugar.entity';
import { SugarService } from './sugar.service';

@Module({
  modules: [TypeOrmModule.forFeature([Sugar])],
  controllers: [SugarController],
  components: [SugarService],
})
export class SugarModule {
}
