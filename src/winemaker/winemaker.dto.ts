import { IsDefined, IsInt, IsNotEmpty, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Winemaker } from './winemaker.entity';
import { DPlace } from '../place/place.dto';
import { DFile } from '../file/file.dto';

export class DWinemaker {
  id: number;

  @IsString() @IsDefined() @IsNotEmpty() @MaxLength(100)
  name: string;

  @IsDefined() @ValidateNested({ each: true }) @Type(() => DFile)
  images: DFile[];

  @IsString() @MaxLength(300)
  website: string;

  @IsString()
  background: string;

  @IsString()
  code: string;

  @IsInt()
  placeId: number;
  place: DPlace;

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
    return r;
  }

  static createList(entities: Winemaker[]) {
    return entities.map(e => DWinemaker.create(e));
  }
}
