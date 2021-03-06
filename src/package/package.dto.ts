import { DFile } from '../file/file.dto';
import { File } from '../file/file.entity';
import { WinePackage } from './wine-package.entity';

const mags = ' KMGTPEZY';

function humanSize(bytes, precision) {
  const magnitude = Math.min(Math.log(bytes) / Math.log(1024) | 0, mags.length - 1);
  const result = bytes / Math.pow(1024, magnitude);
  const suffix = mags[magnitude].trim() + 'B';
  return result.toFixed(precision) + suffix;
}

export class DPackage {
  id: number;
  wineCount: number;
  date: Date;
  url: string;
  size: number;
  sizeHuman: string;
  active: boolean;
  model: DFile;
  json: DFile;

  static create(entity: WinePackage) {
    const r = new DPackage();
    r.id = entity.id;
    r.wineCount = entity.wineCount;
    r.date = entity.date;
    r.url = entity.file ? entity.file.url : null;
    r.size = entity.size;
    r.sizeHuman = humanSize(entity.size, 2);
    r.active = entity.active;
    r.model = entity.model ? DFile.create(entity.model) : null;
    r.json = entity.json ? DFile.create(entity.json) : null;
    return r;
  }

  static createList(packs: WinePackage[]) {
    return packs.map(pack => DPackage.create(pack));
  }
}

export class DReadyResources {
  model: DFile;

  constructor(
    public wineCount: number,
    public winemakerCount: number,
    public fileCount: number,
    model: File,
  ) {
    this.model = model ? DFile.create(model) : null;
  }
}