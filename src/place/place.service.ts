import { Component, NotFoundException } from '@nestjs/common';
import { DPlace } from './place.dto';
import { Place } from './place.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Component()
export class PlaceService {

  constructor(
    @InjectRepository(Place) private repo: Repository<Place>
  ) {
  }

  async create(data: DPlace) {
    const place = new Place();
    return this.update(place, data);
  }

  async update(place: Place, data: DPlace) {
    place.name = data.name;
    place.coordinates = data.coordinates;
    return this.repo.save(place);
  }

  async get(id: number) {
    const place = await this.repo.findOne(id);
    if(!place) throw new NotFoundException('place');
    return place;
  }

  async remove(placeId: number) {
    await this.repo.delete({ id: placeId });
  }

  async list() {
    return this.repo.find({});
  }
}
