import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DWineType } from './wine-type.dto';
import { WineType } from './wine-type.entity';

@Injectable()
export class WineTypeService {

  constructor(
    @InjectRepository(WineType) private repo: Repository<WineType>
  ) {
  }

  async create(data: DWineType) {
    const wineType = new WineType();
    return this.update(wineType, data);
  }

  async update(wineType: WineType, data: DWineType) {
    wineType.name = data.name;
    return this.repo.save(wineType);
  }

  async get(id: number) {
    const wineType = await this.repo.findOne(id);
    if(!wineType) throw new NotFoundException('wineType');
    return wineType;
  }

  async remove(wineTypeId: number) {
    await this.repo.delete({ id: wineTypeId });
  }

  async list() {
    return this.repo.find({});
  }
}
