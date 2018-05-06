import { Module } from '@nestjs/common';
import { WinemakerController } from './winemaker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Winemaker } from './winemaker.entity';
import { WinemakerService } from './winemaker.service';

@Module({
  modules: [TypeOrmModule.forFeature([Winemaker])],
  controllers: [WinemakerController],
  components: [WinemakerService],
})
export class WinemakerModule {
}
