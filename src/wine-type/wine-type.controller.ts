import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { DWineType } from './wine-type.dto';
import { WineTypeService } from './wine-type.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('wine-types')
@UseGuards(AuthGuard)
export class WineTypeController {

  constructor(
    private service: WineTypeService,
  ) {
  }

  @Get()
  async list() {
    const wineTypes = await this.service.list();
    return DWineType.createList(wineTypes);
  }

  @Post()
  async create(@Body() data: DWineType) {
    let wineType = await this.service.create(data);
    return DWineType.create(wineType);
  }

  @Get(':wineTypeId')
  async get(@Param('wineTypeId', new ParseIntPipe()) wineTypeId: number) {
    let wineType = await this.service.get(wineTypeId);
    return DWineType.create(wineType);
  }

  @Put(':wineTypeId')
  async update(@Body() data: DWineType, @Param('wineTypeId', new ParseIntPipe()) wineTypeId: number) {
    let wineType = await this.service.get(wineTypeId);
    wineType = await this.service.update(wineType, data);
    return DWineType.create(wineType);
  }

  @Delete(':wineTypeId')
  async remove(@Param('wineTypeId', new ParseIntPipe()) wineTypeId: number) {
    await this.service.remove(wineTypeId);
  }

}
