import { Component, NotFoundException } from '@nestjs/common';
import { DWinemaker } from './winemaker.dto';
import { Winemaker } from './winemaker.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CannotDeleteException } from '../cannot-delete.exception';
import { FileService } from '../file/file.service';

@Component()
export class WinemakerService {

  constructor(
    @InjectRepository(Winemaker) private repo: Repository<Winemaker>,
    private fileService: FileService,
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
    winemaker.images = await this.fileService.findMany(data.images.map(i => i.id));
    winemaker.video = data.video ? await this.fileService.get(data.video.id) : null;

    return this.repo.save(winemaker);
  }

  async get(id: number) {
    const winemaker = await this.repo.findOne(id, { relations: ['images', 'video'] });
    if(!winemaker) throw new NotFoundException('winemaker');
    return winemaker;
  }

  async remove(winemakerId: number) {
    try {
      await this.repo.delete({ id: winemakerId });
    } catch (e) {
      throw new CannotDeleteException('winemaker');
    }
  }

  list() {
    return this.repo.createQueryBuilder('winemaker')
      .leftJoinAndSelect('winemaker.place', 'place')
      .orderBy('place.name', 'ASC')
      .addOrderBy('winemaker.name', 'ASC')
      .getMany();
  }
}
