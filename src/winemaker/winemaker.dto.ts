import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsString, MaxLength, ValidateNested } from 'class-validator';

import { DFile } from '../file/file.dto';
import { DLocaleString, DLocaleText } from '../locale/locale.dto';
import { DPlace } from '../place/place.dto';
import { DWine } from '../wine/wine.dto';
import { Winemaker } from './winemaker.entity';

export class DWinemaker {
  id: number;

  @ValidateNested() @Type(() => DLocaleString)
  name: DLocaleString;

  @IsDefined() @ValidateNested({ each: true }) @Type(() => DFile)
  images: DFile[];

  @ValidateNested() @Type(() => DFile)
  video: DFile;

  @IsString() @MaxLength(300)
  website: string;

  @ValidateNested() @Type(() => DLocaleText)
  background: DLocaleText;

  @IsString()
  code: string;

  @IsInt()
  placeId: number;
  place: DPlace;

  wines: DWine[];

  static create(entity: Winemaker) {
    const r = new DWinemaker();
    r.id = entity.id;
    r.name = entity.name;
    r.website = entity.website;
    r.background = entity.background;
    r.code = entity.code;
    r.placeId = entity.placeId;
    if (entity.place) {
      r.place = DPlace.create(entity.place);
    }
    if (entity.images) {
      r.images = entity.images.map(i => DFile.create(i));
    }
    if (entity.video) {
      r.video = DFile.create(entity.video);
    }
    if (entity.wines) {
      r.wines = entity.wines.map(DWine.create);
    }
    return r;
  }

  static createList(entities: Winemaker[]) {
    return entities.map(e => DWinemaker.create(e));
  }
}
