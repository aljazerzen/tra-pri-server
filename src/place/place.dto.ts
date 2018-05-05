import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DCoordinates } from '../coordinates/coordinates.dto';
import { Place } from './place.entity';

export class DPlace {
  id: number;

  @IsString()
  name: string;

  @ValidateNested() @Type(() => DCoordinates) @IsDefined()
  coordinates: DCoordinates;

  static create(entity: Place) {
    const r = new DPlace();
    r.id = entity.id;
    r.name = entity.name;
    r.coordinates = DCoordinates.create(entity.coordinates);
    return r;
  }

  static createList(entities: Place[]) {
    return entities.map(e => DPlace.create(e));
  }
}
