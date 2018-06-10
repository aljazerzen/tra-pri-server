import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, ValidateNested } from 'class-validator';

import { DLocaleString, DLocaleText } from '../locale/locale.dto';
import { DFile } from './../file/file.dto';
import { Variety } from './variety.entity';

export class DVariety {
  id: number;

  @ValidateNested() @Type(() => DLocaleString)
  name: DLocaleString;

  @IsDefined() @ValidateNested({ each: true }) @Type(() => DFile)
  images: DFile[];

  @ValidateNested() @Type(() => DLocaleText)
  description: DLocaleText;

  @IsBoolean()
  hasLocalOrigins: boolean;

  static create(entity: Variety) {
    const r = new DVariety();
    r.id = entity.id;
    r.name = entity.name;
    r.description = entity.description;
    r.hasLocalOrigins= entity.hasLocalOrigins;
    if (entity.images) {
      r.images = entity.images.map(i => DFile.create(i));
    }
    return r;
  }

  static createList(entities: Variety[]) {
    return entities.map(e => DVariety.create(e));
  }
}
