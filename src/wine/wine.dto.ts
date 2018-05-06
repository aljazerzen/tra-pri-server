import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Wine } from './wine.entity';

export class DWine {
  id: number;

  @IsString() @IsDefined() @IsNotEmpty() @MaxLength(100)
  name: string;

  @IsInt() @Min(1000) @Max(3000)
  year: number;

  @IsString()
  culinary: string;
  @IsString()
  temperature: string;
  @IsString()
  features: string;

  @IsString()
  awards: string;

  @IsNumber()
  price: number;

  @IsNumber() @Min(0) @Type(() => Number)
  volume: number;

  @IsNumber() @Min(0) @Type(() => Number)
  abv: number;

  @IsString()
  code: string;

  static create(entity: Wine) {
    const r = new DWine();
    r.id = entity.id;
    r.name = entity.name;
    r.year = entity.year;
    r.culinary = entity.culinary;
    r.temperature = entity.temperature;
    r.features = entity.features;
    r.awards = entity.awards;
    r.price = entity.price;
    r.volume = entity.volume;
    r.abv = entity.abv;
    r.code = entity.code;
    return r;
  }

  static createList(entities: Wine[]) {
    return entities.map(e => DWine.create(e));
  }
}
