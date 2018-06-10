import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { DLocaleString } from '../locale/locale.dto';
import { Sugar } from './sugar.entity';

export class DSugar {
  id: number;

  @ValidateNested() @Type(() => DLocaleString)
  name: DLocaleString;

  static create(entity: Sugar) {
    const r = new DSugar();
    r.id = entity.id;
    r.name = DLocaleString.create(entity.name);
    return r;
  }

  static createList(entities: Sugar[]) {
    return entities.map(e => DSugar.create(e));
  }
}
