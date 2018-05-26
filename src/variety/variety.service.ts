import { FileService } from './../file/file.service';
import { Component, NotFoundException } from '@nestjs/common';
import { DVariety } from './variety.dto';
import { Variety } from './variety.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Component()
export class VarietyService {

  constructor(
    @InjectRepository(Variety) private repo: Repository<Variety>,
    private fileService: FileService,
  ) {
  }

  async create(data: DVariety) {
    const variety = new Variety();
    return this.update(variety, data);
  }

  async update(variety: Variety, data: DVariety) {
    variety.name = data.name;
    variety.description = data.description;
    variety.hasLocalOrigins = data.hasLocalOrigins;
    variety.images = await this.fileService.findMany(data.images.map(i => i.id));

    return this.repo.save(variety);
  }

  async get(id: number) {
    const variety = await this.repo.findOne(id, { relations: ['images'] });
    if (!variety) throw new NotFoundException('variety');
    return variety;
  }

  async getMany(ids: number[]) {
    if(ids.length === 0)
      return [];

    const varieties = await this.repo.createQueryBuilder('variety')
      .where('id IN (:...ids)', { ids })
      .getMany();

    if (varieties.length < ids.length)
      throw new NotFoundException('varieties');
    return varieties;
  }

  async remove(varietyId: number) {
    await this.repo.delete({ id: varietyId });
  }

  async list() {
    return this.repo.find({});
  }
}
