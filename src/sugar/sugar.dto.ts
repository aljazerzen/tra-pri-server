import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Sugar } from './sugar.entity';

export class DSugar {
  id: number;

  @IsString() @IsDefined() @IsNotEmpty() @MaxLength(100)
  name: string;

  static create(entity: Sugar) {
    const r = new DSugar();
    r.id = entity.id;
    r.name = entity.name;
    return r;
  }

  static createList(entities: Sugar[]) {
    return entities.map(e => DSugar.create(e));
  }
}
