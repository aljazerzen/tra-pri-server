import { IsDefined, IsInt } from 'class-validator';

import { File } from './file.entity';

export class DFile {
  @IsInt() @IsDefined()
  id: number;

  url: string;
  createdAt: Date;
  type: string;

  static create(entity: File) {
    const r = new DFile();
    r.id = entity.id;
    r.url = entity.url;
    r.createdAt = entity.createdAt;
    r.type = entity.type.toString();
    return r;
  }
}
