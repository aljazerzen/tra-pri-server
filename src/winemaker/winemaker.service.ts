import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CannotDeleteException } from '../cannot-delete.exception';
import { FileService } from '../file/file.service';
import { DWinemaker } from './winemaker.dto';
import { Winemaker } from './winemaker.entity';

@Injectable()
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

  async get(id: number, relations: string[] = ['images', 'video']) {
    const winemaker = await this.repo.findOne(id, { relations });
    if (!winemaker) throw new NotFoundException('winemaker');
    return winemaker;
  }

  async remove(winemakerId: number) {
    try {
      await this.repo.delete({ id: winemakerId });
    } catch (e) {
      throw new CannotDeleteException('winemaker');
    }
  }

  list(relations: string[] = ['images', 'video']) {
    return this.repo.find({ relations, order: { 'id': 'ASC' } })
  }

  async getCount() {
    return this.repo.count();
  }
}
