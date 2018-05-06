import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Winemaker } from './winemaker.entity';
import { DPlace } from '../place/place.dto';

export class DWinemaker {
  id: number;

  @IsString() @IsDefined() @IsNotEmpty() @MaxLength(100)
  name: string;

  @IsString() @IsDefined() @IsNotEmpty() @MaxLength(300)
  website: string;

  @IsString()
  background: string;

  @IsString()
  code: string;

  place: DPlace;

  static create(entity: Winemaker) {
    const r = new DWinemaker();
    r.id = entity.id;
    r.name = entity.name;
    r.website = entity.website;
    r.background = entity.background;
    r.code = entity.code;
    if (entity.place)
      r.place = DPlace.create(entity.place);
    return r;
  }

  static createList(entities: Winemaker[]) {
    return entities.map(e => DWinemaker.create(e));
  }
}
