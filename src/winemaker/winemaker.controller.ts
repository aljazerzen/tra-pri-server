import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { DWinemaker } from './winemaker.dto';
import { WinemakerService } from './winemaker.service';

@Controller('winemakers')
export class WinemakerController {

  constructor(
    private service: WinemakerService,
  ) {
  }

  @Get()
  async list() {
    const winemakers = await this.service.list();
    return DWinemaker.createList(winemakers);
  }

  @Post()
  async create(@Body() data: DWinemaker) {
    let winemaker = await this.service.create(data);
    return DWinemaker.create(winemaker);
  }

  @Get(':winemakerId')
  async get(@Param('winemakerId', new ParseIntPipe()) winemakerId: number) {
    let winemaker = await this.service.get(winemakerId);
    return DWinemaker.create(winemaker);
  }

  @Put(':winemakerId')
  async update(@Body() data: DWinemaker, @Param('winemakerId', new ParseIntPipe()) winemakerId: number) {
    let winemaker = await this.service.get(winemakerId);
    winemaker = await this.service.update(winemaker, data);
    return DWinemaker.create(winemaker);
  }

  @Delete(':winemakerId')
  async remove(@Param('winemakerId', new ParseIntPipe()) winemakerId: number) {
    await this.service.remove(winemakerId);
  }

}
