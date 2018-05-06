import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { DWine } from './wine.dto';
import { WineService } from './wine.service';

@Controller('wines')
export class WineController {

  constructor(
    private service: WineService,
  ) {
  }

  @Get()
  async list() {
    const wines = await this.service.list();
    return DWine.createList(wines);
  }

  @Post()
  async create(@Body() data: DWine) {
    let wine = await this.service.create(data);
    return DWine.create(wine);
  }

  @Get(':wineId')
  async get(@Param('wineId', new ParseIntPipe()) wineId: number) {
    let wine = await this.service.get(wineId);
    return DWine.create(wine);
  }

  @Put(':wineId')
  async update(@Body() data: DWine, @Param('wineId', new ParseIntPipe()) wineId: number) {
    let wine = await this.service.get(wineId);
    wine = await this.service.update(wine, data);
    return DWine.create(wine);
  }

  @Delete(':wineId')
  async remove(@Param('wineId', new ParseIntPipe()) wineId: number) {
    await this.service.remove(wineId);
  }

}
