import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SugarController } from './sugar.controller';
import { Sugar } from './sugar.entity';
import { SugarService } from './sugar.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sugar])],
  controllers: [SugarController],
  providers: [SugarService],
})
export class SugarModule {
}
