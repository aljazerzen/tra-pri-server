import { Module } from '@nestjs/common';
import { WinemakerController } from './winemaker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Winemaker } from './winemaker.entity';
import { WinemakerService } from './winemaker.service';
import { FileModule } from '../file/file.module';
import { FileService } from '../file/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([Winemaker]), FileModule],
  controllers: [WinemakerController],
  components: [WinemakerService],
})
export class WinemakerModule {
}
