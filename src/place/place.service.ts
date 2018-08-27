import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FileService } from '../file/file.service';
import { DPlace } from './place.dto';
import { Place } from './place.entity';

@Injectable()
export class PlaceService {

  constructor(
    @InjectRepository(Place) private repo: Repository<Place>,
    private file: FileService,
  ) {
  }

  async create(data: DPlace) {
    const place = new Place();
    return this.update(place, data);
  }

  async update(place: Place, data: DPlace) {
    place.name = data.name;
    place.image = await this.file.get(data.image.id);
    return this.repo.save(place);
  }

  async get(id: number) {
    const place = await this.repo.findOne(id, { relations: ['image'] });
    if (!place) throw new NotFoundException('place');
    return place;
  }

  async remove(placeId: number) {
    await this.repo.delete({ id: placeId });
  }

  list() {
    return this.repo.find({ order: { name: 'ASC' } });
  }
}
