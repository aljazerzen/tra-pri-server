import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as archiver from 'archiver';
import * as path from 'path';
import { Repository } from 'typeorm';

import { FILE_TYPE } from '../file/file.constants';
import { File } from '../file/file.entity';
import { FileService } from '../file/file.service';
import { Wine } from '../wine/wine.entity';
import { WineService } from '../wine/wine.service';
import { WinePackage } from './wine-package.entity';

// noinspection ES6UnusedImports
const defaultToSl = (locale: { sl: string, en: string }) => ({ sl: locale.sl, en: locale.en || locale.sl });

@Injectable()
export class PackageService {

  constructor(
    private wineService: WineService,
    private fileService: FileService,
    @InjectRepository(WinePackage) private repo: Repository<WinePackage>
  ) {
  }

  list() {
    return this.repo.find({ relations: ['file', 'model'], order: { date: 'DESC' } });
  }

  async setActive(packageId: number) {
    if (0 <= packageId)
      await this.repo.query(`UPDATE wine_package SET active = (id = ${+packageId})`);
  }

  async getActive() {
    const pack = await this.repo.findOne({ where: { active: true }, relations: ['file', 'model'] });
    if (!pack) throw new NotFoundException('active package', 'NO_ACTIVE_PACKAGE');
    return pack;
  }

  async createPackage() {
    const wines = await this.wineService.listFull();
    const currentModel = await this.fileService.getLastOfType(FILE_TYPE.MODEL);
    const { data, images } = this.simplify(wines, currentModel);

    const pack = new WinePackage();
    pack.wineCount = data.wines.length;
    pack.date = new Date();
    pack.size = 0;
    pack.model = currentModel;
    await this.repo.save(pack);

    const { file, size } = await this.compress(data, images, 'paket_v' + pack.id);

    pack.size = size;
    pack.file = file;
    await this.repo.save(pack);
    return pack;
  }

  simplify(wines: Wine[], model: File) {
    const images: { name: string, file: File }[] = [];

    const useImage = (file: File) => {
      const existing = images.find(im => im.file.id == file.id);
      if (existing)
        return existing.name;

      const name = '' + images.length + path.extname(file.path);
      images.push({ name, file });
      return name;
    };

    const mappedWines = wines.map(wine => ({
      abv: +wine.abv,
      awards: wine.awards,
      code: wine.code || null,
      culinary: wine.culinary,
      features: wine.features,
      id: wine.id,
      name: wine.name,
      images: (wine.images || []).map(useImage),
      price: +wine.price,
      sugar: wine.sugar ? wine.sugar.name : '',
      temperature: wine.temperature,
      type: wine.type ? wine.type.name : '',
      varieties: (wine.varieties || []).map(variety => ({
        name: defaultToSl(variety.name),
        description: variety.description,
        hasLocalOrigins: variety.hasLocalOrigins,
        images: (variety.images || []).map(useImage),
      })),
      volume: +wine.volume,
      winemaker: {
        name: defaultToSl(wine.winemaker.name),
        website: wine.winemaker.website,
        images: (wine.winemaker.images || []).map(useImage),
        video: (wine.winemaker.video || { url: null }).url,
        background: wine.winemaker.background,
        code: wine.winemaker.code,
        place: wine.winemaker.place,
        wines: wine.winemaker.wines,
      },
      year: wine.year || null,
      classNumber: wine.classNumber,
    }));

    return { data: { wines: mappedWines, model: model.url }, images };
  }

  async compress(jsonData, images: { name: string, file: File }[], name: string) {

    const archive = archiver('zip', { zlib: { level: 9 } });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
        console.log(err);
      } else {
        // throw error
        throw err;
      }
    });

    // good practice to catch this error explicitly
    archive.on('error', function (err) {
      throw err;
    });

    // pipe archive data to the file
    const filePromise = this.fileService.save(archive, FILE_TYPE.PACKAGE, name + '.zip');

    // package.json
    const buffer = Buffer.from(JSON.stringify(jsonData));
    archive.append(buffer, { name: 'package.json' });

    // images/
    for (let image of images) {
      archive.append(this.fileService.readStream(image.file), { name: 'images/' + image.name });
    }

    archive.finalize();

    const file = await filePromise;
    const size = archive.pointer();
    return { file, size };
  }
}
