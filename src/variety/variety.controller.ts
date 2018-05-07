import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { DVariety } from './variety.dto';
import { VarietyService } from './variety.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('varieties')
@UseGuards(AuthGuard)
export class VarietyController {

  constructor(
    private service: VarietyService,
  ) {
  }

  @Get()
  async list() {
    const varieties = await this.service.list();
    return DVariety.createList(varieties);
  }

  @Post()
  async create(@Body() data: DVariety) {
    let variety = await this.service.create(data);
    return DVariety.create(variety);
  }

  @Get(':varietyId')
  async get(@Param('varietyId', new ParseIntPipe()) varietyId: number) {
    let variety = await this.service.get(varietyId);
    return DVariety.create(variety);
  }

  @Put(':varietyId')
  async update(@Body() data: DVariety, @Param('varietyId', new ParseIntPipe()) varietyId: number) {
    let variety = await this.service.get(varietyId);
    variety = await this.service.update(variety, data);
    return DVariety.create(variety);
  }

  @Delete(':varietyId')
  async remove(@Param('varietyId', new ParseIntPipe()) varietyId: number) {
    await this.service.remove(varietyId);
  }

}
