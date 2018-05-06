import { Component, NotFoundException } from '@nestjs/common';
import { DSugar } from './sugar.dto';
import { Sugar } from './sugar.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Component()
export class SugarService {

  constructor(
    @InjectRepository(Sugar) private repo: Repository<Sugar>
  ) {
  }

  async create(data: DSugar) {
    const sugar = new Sugar();
    return this.update(sugar, data);
  }

  async update(sugar: Sugar, data: DSugar) {
    sugar.name = data.name;
    return this.repo.save(sugar);
  }

  async get(id: number) {
    const sugar = await this.repo.findOne(id);
    if(!sugar) throw new NotFoundException('sugar');
    return sugar;
  }

  async remove(sugarId: number) {
    await this.repo.delete({ id: sugarId });
  }

  async list() {
    return this.repo.find({});
  }
}
