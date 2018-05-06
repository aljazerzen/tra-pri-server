import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { WineType } from './wine-type.entity';

export class DWineType {
  id: number;

  @IsString() @IsDefined() @IsNotEmpty() @MaxLength(100)
  name: string;

  static create(entity: WineType) {
    const r = new DWineType();
    r.id = entity.id;
    r.name = entity.name;
    return r;
  }

  static createList(entities: WineType[]) {
    return entities.map(e => DWineType.create(e));
  }
}
