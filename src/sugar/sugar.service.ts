import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CannotDeleteException } from '../cannot-delete.exception';
import { DSugar } from './sugar.dto';
import { Sugar } from './sugar.entity';

@Injectable()
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
    try {
      await this.repo.delete({ id: sugarId });
    } catch(e) {
      throw new CannotDeleteException('sugar');
    }
  }

  async list() {
    return this.repo.find({ order: { id: 'ASC' } });
  }
}
