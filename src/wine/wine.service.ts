import { Component, NotFoundException } from '@nestjs/common';
import { DWine } from './wine.dto';
import { Wine } from './wine.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VarietyService } from '../variety/variety.service';

@Component()
export class WineService {

  constructor(
    @InjectRepository(Wine) private repo: Repository<Wine>,
    private varietyService: VarietyService,
  ) {
  }

  async create(data: DWine) {
    const wine = new Wine();
    return this.update(wine, data);
  }

  async update(wine: Wine, data: DWine) {
    wine.name = data.name;
    wine.year = data.year;
    wine.culinary = data.culinary;
    wine.temperature = data.temperature;
    wine.features = data.features;
    wine.awards = data.awards;
    wine.price = data.price;
    wine.volume = data.volume;
    wine.abv = data.abv;
    wine.code = data.code;
    wine.winemakerId = data.winemakerId;
    wine.typeId = data.typeId;
    wine.sugarId = data.sugarId;
    wine.varieties = data.varietyIds ? await this.varietyService.getMany(data.varietyIds) : [];

    return this.repo.save(wine);
  }

  async get(id: number) {
    const wine = await this.repo.findOne(id, { relations: ['varieties'] });
    if (!wine) throw new NotFoundException('wine');
    return wine;
  }

  async remove(wineId: number) {
    await this.repo.delete({ id: wineId });
  }

  async list(relations: string[] = []) {
    return this.repo.find({ order: { name: 'ASC' }, relations });
  }

  listFull() {
    return this.list(['winemaker', 'winemaker.place', 'winemaker.images', 'varieties', 'sugar', 'type']);
  }
}
