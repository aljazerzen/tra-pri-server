import { Component, NotFoundException } from '@nestjs/common';
import { DWinemaker } from './winemaker.dto';
import { Winemaker } from './winemaker.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from '../place/place.entity';

@Component()
export class WinemakerService {

  constructor(
    @InjectRepository(Winemaker) private repo: Repository<Winemaker>
  ) {
  }

  async create(data: DWinemaker) {
    const winemaker = new Winemaker();
    return this.update(winemaker, data);
  }

  async update(winemaker: Winemaker, data: DWinemaker) {
    winemaker.name = data.name;
    winemaker.website = data.website;
    winemaker.background = data.background;
    winemaker.code = data.code;
    winemaker.placeId = data.placeId;
    return this.repo.save(winemaker);
  }

  async get(id: number) {
    const winemaker = await this.repo.findOne(id);
    if(!winemaker) throw new NotFoundException('winemaker');
    return winemaker;
  }

  async remove(winemakerId: number) {
    await this.repo.delete({ id: winemakerId });
  }

  list() {
    return this.repo.createQueryBuilder('winemaker')
      .leftJoinAndSelect('winemaker.place', 'place')
      .orderBy('place.name', 'ASC')
      .addOrderBy('winemaker.name', 'ASC')
      .getMany();
  }
}
