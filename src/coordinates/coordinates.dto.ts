import { IsDefined, IsNumber, Max, Min } from 'class-validator';
import { Coordinates } from './coordinates.entity';

export class DCoordinates {

  @IsNumber() @Min(-90) @Max(90) @IsDefined()
  lat: number;
  @IsNumber() @Min(-180) @Max(180) @IsDefined()
  lng: number;

  static create(entity: Coordinates) {
    const r = new DCoordinates();
    r.lat = entity.lat;
    r.lng = entity.lng;
    return r;
  }
}
