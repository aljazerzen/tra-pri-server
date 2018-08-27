import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { DFile } from '../file/file.dto';
import { DLocaleString } from '../locale/locale.dto';
import { WineType } from './wine-type.entity';

export class DWineType {
  id: number;

  @ValidateNested() @Type(() => DLocaleString)
  name: DLocaleString;

  @ValidateNested() @Type(() => DFile)
  image: DFile;

  static create(entity: WineType) {
    const r = new DWineType();
    r.id = entity.id;
    r.name = entity.name;
    if (entity.image)
      r.image = DFile.create(entity.image);
    return r;
  }

  static createList(entities: WineType[]) {
    return entities.map(e => DWineType.create(e));
  }
}
