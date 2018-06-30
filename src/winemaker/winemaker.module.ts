import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileModule } from '../file/file.module';
import { WinemakerController } from './winemaker.controller';
import { Winemaker } from './winemaker.entity';
import { WinemakerService } from './winemaker.service';

@Module({
  imports: [TypeOrmModule.forFeature([Winemaker]), FileModule],
  controllers: [WinemakerController],
  providers: [WinemakerService],
})
export class WinemakerModule {
}
