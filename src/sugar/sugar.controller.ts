import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { DSugar } from './sugar.dto';
import { SugarService } from './sugar.service';

@Controller('sugars')
export class SugarController {

  constructor(
    private service: SugarService,
  ) {
  }

  @Get()
  async list() {
    const sugars = await this.service.list();
    return DSugar.createList(sugars);
  }

  @Post()
  async create(@Body() data: DSugar) {
    let sugar = await this.service.create(data);
    return DSugar.create(sugar);
  }

  @Get(':sugarId')
  async get(@Param('sugarId', new ParseIntPipe()) sugarId: number) {
    let sugar = await this.service.get(sugarId);
    return DSugar.create(sugar);
  }

  @Put(':sugarId')
  async update(@Body() data: DSugar, @Param('sugarId', new ParseIntPipe()) sugarId: number) {
    let sugar = await this.service.get(sugarId);
    sugar = await this.service.update(sugar, data);
    return DSugar.create(sugar);
  }

  @Delete(':sugarId')
  async remove(@Param('sugarId', new ParseIntPipe()) sugarId: number) {
    await this.service.remove(sugarId);
  }

}
