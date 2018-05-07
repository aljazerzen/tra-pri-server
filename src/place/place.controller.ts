import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { DPlace } from './place.dto';
import { PlaceService } from './place.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('places')
@UseGuards(AuthGuard)
export class PlaceController {

  constructor(
    private service: PlaceService,
  ) {

  }

  @Get()
  async list() {
    const places = await this.service.list();
    return DPlace.createList(places);
  }

  @Post()
  async create(@Body() data: DPlace) {
    let place = await this.service.create(data);
    return DPlace.create(place);
  }

  @Get(':placeId')
  async get(@Param('placeId', new ParseIntPipe()) placeId: number) {
    let place = await this.service.get(placeId);
    return DPlace.create(place);
  }

  @Put(':placeId')
  async update(@Body() data: DPlace, @Param('placeId', new ParseIntPipe()) placeId: number) {
    let place = await this.service.get(placeId);
    place = await this.service.update(place, data);
    return DPlace.create(place);
  }

  @Delete(':placeId')
  async remove(@Param('placeId', new ParseIntPipe()) placeId: number) {
    await this.service.remove(placeId);
  }

}
