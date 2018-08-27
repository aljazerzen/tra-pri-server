import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';

import { DFile } from '../file/file.dto';
import { Place } from './place.entity';

export class DPlace {
  id: number;

  @IsDefined() @IsString()
  name: string;

  @IsDefined() @ValidateNested() @Type(() => DFile)
  image: DFile;

  static create(entity: Place) {
    const r = new DPlace();
    r.id = entity.id;
    r.name = entity.name;
    if (entity.image)
      r.image = DFile.create(entity.image);
    return r;
  }

  static createList(entities: Place[]) {
    return entities.map(e => DPlace.create(e));
  }
}
