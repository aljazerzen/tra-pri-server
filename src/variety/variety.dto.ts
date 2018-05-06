import { IsBoolean, IsDefined, IsInt, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Variety } from './variety.entity';

export class DVariety {
  id: number;

  @IsString() @IsDefined() @IsNotEmpty() @MaxLength(100)
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  hasLocalOrigins: boolean;

  static create(entity: Variety) {
    const r = new DVariety();
    r.id = entity.id;
    r.name = entity.name;
    r.description = entity.description;
    r.hasLocalOrigins= entity.hasLocalOrigins;
    return r;
  }

  static createList(entities: Variety[]) {
    return entities.map(e => DVariety.create(e));
  }
}
