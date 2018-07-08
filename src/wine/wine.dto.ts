import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { DLocaleText } from '../locale/locale.dto';
import { DSugar } from '../sugar/sugar.dto';
import { DVariety } from '../variety/variety.dto';
import { DWineType } from '../wine-type/wine-type.dto';
import { DWinemaker } from '../winemaker/winemaker.dto';
import { DFile } from './../file/file.dto';
import { Wine } from './wine.entity';

export class DTemperature {
  @IsNumber()
  from: number;
  @IsNumber()
  to: number;
}

export class DWine {
  id: number;

  @IsString() @IsDefined() @IsNotEmpty() @MaxLength(100)
  name: string;

  @IsDefined() @ValidateNested({ each: true }) @Type(() => DFile)
  images: DFile[];

  @IsInt() @Min(1000) @Max(3000)
  year: number;

  @ValidateNested() @Type(() => DLocaleText)
  culinary: DLocaleText;
  @ValidateNested() @Type(() => DLocaleText)
  features: DLocaleText;
  @ValidateNested() @Type(() => DLocaleText)
  awards: DLocaleText;

  @ValidateNested() @Type(() => DTemperature) @IsDefined()
  temperature: DTemperature;

  @IsNumber() @Min(0) @Type(() => Number)
  price: number;

  @IsNumber() @Min(0) @Type(() => Number)
  volume: number;

  @IsNumber() @Min(0) @Type(() => Number)
  abv: number;

  @IsString()
  code: string;

  @IsInt()
  winemakerId: number;
  winemaker: DWinemaker;

  @IsInt()
  typeId: number;
  type: DWineType;

  @IsInt()
  sugarId: number;
  sugar: DSugar;

  @IsInt({ each: true }) @IsArray()
  varietyIds: number[];
  varieties: DVariety[];

  static create(entity: Wine) {
    const r = new DWine();
    r.id = entity.id;
    r.name = entity.name;
    r.year = entity.year;
    // r.culinary = { sl: entity.culinary, en: '' };
    // r.temperature = { sl: entity.temperature, en: '' };
    // r.features = { sl: entity.features, en: '' };
    // r.awards = { sl: entity.awards, en: '' };

    r.culinary = DLocaleText.create(entity.culinary);
    r.temperature = entity.temperature;
    r.features = DLocaleText.create(entity.features);
    r.awards = DLocaleText.create(entity.awards);
    r.price = entity.price;
    r.volume = entity.volume;
    r.abv = entity.abv;
    r.code = entity.code;
    r.winemakerId = entity.winemakerId;
    r.typeId = entity.typeId;
    r.sugarId = entity.sugarId;

    if (entity.winemaker)
      r.winemaker = DWinemaker.create(entity.winemaker);
    if (entity.type)
      r.type = DWineType.create(entity.type);
    if (entity.sugar)
      r.sugar = DSugar.create(entity.sugar);
    if (entity.varieties)
      r.varieties = DVariety.createList(entity.varieties);
    if (entity.images) {
      r.images = entity.images.map(i => DFile.create(i));
    }

    return r;
  }

  static createList(entities: Wine[]) {
    return entities.map(e => DWine.create(e));
  }
}

export class DWineLabelSummary {
  id: number;
  name: string;
  year: number;
  labelImageCount: number;
  hasLabelImageCoordinates: boolean;

  winemaker: DWinemaker;

  static create(entity: Wine) {
    const r = new DWineLabelSummary();
    r.id = entity.id;
    r.name = entity.name;
    r.year = entity.year;
    r.labelImageCount = entity.labels.length;

    const firstLabel = entity.labels.find(l => l.index == 0);
    r.hasLabelImageCoordinates = firstLabel && firstLabel.coordinates !== null;

    if (entity.winemaker)
      r.winemaker = DWinemaker.create(entity.winemaker);

    return r;
  }

  static createList(entities: Wine[]) {
    return entities.map(e => DWineLabelSummary.create(e));
  }
}

export class DWineLabels {
  id: number;
  name: string;
  year: number;
  winemaker: DWinemaker;

  @IsDefined() // @ValidateNested({ each: true }) @Type(() => DFile)  
  labels: DFile[];
  @ValidateNested() @Type(() => DFile)
  labelImageCoordinates: DFile;
  @IsArray() @ArrayMinSize(12) @ArrayMaxSize(12)
  coordinates: number[];

  static create(entity: Wine) {
    const r = new DWineLabels();
    r.id = entity.id;
    r.name = entity.name;
    r.year = entity.year;
    if (entity.winemaker)
      r.winemaker = DWinemaker.create(entity.winemaker);

    r.labels = [];
    for (const label of entity.labels) {
      if (label) {
        r.labels[label.index] = DFile.create(label.image);

        if (label.index === 0) {
          r.coordinates = label ? label.coordinates : null;
        }
      }
    }

    return r;
  }
}