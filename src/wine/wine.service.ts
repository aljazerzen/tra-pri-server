import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VarietyService } from '../variety/variety.service';
import { Label } from '../wine/label.entity';
import { FileService } from './../file/file.service';
import { DWine, DWineLabels } from './wine.dto';
import { Wine } from './wine.entity';

@Injectable()
export class WineService {

  constructor(
    @InjectRepository(Wine) private repo: Repository<Wine>,
    @InjectRepository(Label) private labelRepo: Repository<Label>,
    private varietyService: VarietyService,
    private fileService: FileService,
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
    wine.images = data.images ? await this.fileService.findMany(data.images.map(i => i.id)) : [];

    return this.repo.save(wine);
  }

  async updateLabelImages(wine: Wine, data: DWineLabels) {

    const images = await this.fileService.findMany(data.labels.filter(l => !!l).map(l => l.id));

    await this.labelRepo.delete({ wineId: wine.id });

    wine.labels = await Promise.all(
      data.labels.map(async (labelData, index) => {
        if (!labelData) return null;

        const label = new Label();
        label.index = index;
        label.image = images.find(i => i.id === labelData.id);
        label.wine = wine;

        if (index === 0 && data.coordinates) {
          label.coordinates = data.coordinates;
        }

        await this.labelRepo.save(label);
        return label;
      })
    );

    return wine;
  }

  async get(id: number, relations = ['varieties', 'images']) {
    const wine = await this.repo.findOne(id, { relations });
    if (!wine) throw new NotFoundException('wine');
    return wine;
  }

  async remove(wineId: number) {
    await this.repo.delete({ id: wineId });
  }

  async list(relations: string[] = []) {
    return this.repo.find({ order: { winemakerId: 'ASC', name: 'ASC' }, relations });
  }

  listFull() {
    return this.list(['winemaker', 'winemaker.video', 'winemaker.place', 'winemaker.images', 'varieties', 'varieties.images',
      'sugar', 'type', 'images']);
  }

  async saveAll(wines: Wine[]) {
    await this.repo.save(wines);
  }
}
