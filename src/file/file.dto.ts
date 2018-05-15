import { File } from './file.entity';
import { IsDefined, IsInt } from 'class-validator';

export class DFile {
  @IsInt() @IsDefined()
  id: number;

  url: string;

  static create(entity: File) {
    const r = new DFile();
    r.id = entity.id;
    r.url = entity.url;
    return r;
  }
}
