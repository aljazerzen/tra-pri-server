import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { File } from '../file/file.entity';
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

  async list(relations: string[] = [], omitHidden = false) {
    const where = omitHidden ? { hidden: false } : {};

    return this.repo.find({ where, order: { winemakerId: 'ASC', name: 'ASC' }, relations });
  }

  listNotHidden(relations: string[] = []) {
    return this.repo.find({
      where: { hidden: false }, order: { id: 'ASC' }, relations
    });
  }

  listFullNotHidden() {
    return this.listNotHidden([
      'winemaker', 'winemaker.video', 'winemaker.place', 'winemaker.place.image', 'winemaker.images', 'varieties', 'varieties.images', 'sugar', 'type', 'images'
    ]);
  }

  async loadLabels(wines: Wine[]) {
    wines.forEach(w => w.labels = []);

    const results = await this.labelRepo.createQueryBuilder('l')
      .where('"wineId" IN (:...wineIds)', { wineIds: wines.map(w => w.id) })
      .leftJoinAndSelect(File, "f", "f.id = l.imageId")
      .execute() as any[];

    for (const result of results) {
      const label = new Label();
      label.index = result.l_index;
      label.wineId = +result.l_wineId;
      label.imageId = +result.l_imageId;
      label.coordinates = result.l_coordinates;
      label.image = new File();
      label.image.id = +result.f_id;
      label.image.type = result.f_type;
      label.image.path = result.f_path;
      label.image.url = result.f_url;
      label.image.createdAt = new Date(result.f_createdAt);

      wines.find(w => w.id == label.wineId).labels.push(label);
    }
  }

  async saveAll(wines: Wine[]) {
    await this.repo.save(wines);
  }

  async getCount() {
    return this.repo.count();
  }

  async toggleHidden(wine: Wine) {
    wine.hidden = !wine.hidden;
    await this.repo.save(wine);
  }

  async loadLabelCount(wines: Wine[]) {
    const rows = await this.labelRepo.createQueryBuilder()
      .select('"wineId"')
      .addSelect('COUNT(*)', 'count')
      .groupBy('"wineId"')
      .execute() as { wineId: number, count: number }[];

    for (let row of rows) {
      wines
        .filter(w => w.id === row.wineId)
        .forEach(w => w.labelCount = row.count);
    }
  }
}
