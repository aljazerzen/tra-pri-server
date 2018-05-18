import { Component, NotFoundException } from '@nestjs/common';
import { WineService } from '../wine/wine.service';
import { FileService } from '../file/file.service';
import { FILE_TYPE } from '../file/file.constants';
import { WinePackage } from './wine-package.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Wine } from '../wine/wine.entity';
import * as archiver from 'archiver';
import { File } from '../file/file.entity';
import * as path from 'path';
// noinspection ES6UnusedImports
import { Repository } from 'typeorm';

@Component()
export class PackageService {

  constructor(
    private wineService: WineService,
    private fileService: FileService,
    @InjectRepository(WinePackage) private repo : Repository<WinePackage>
  ) {
  }

  list() {
    return this.repo.find({ relations: ['file'], order: { date: 'DESC' } });
  }

  async setActive(packageId: number) {
    if(0 <= packageId)
      await this.repo.query(`UPDATE wine_package SET active = (id = ${+packageId})`);
  }

  async getActive() {
    const pack = await this.repo.findOne({ where: { active: true }, relations: ['file'] });
    if(!pack) throw new NotFoundException('active package', 'NO_ACTIVE_PACKAGE');
    return pack;
  }

  async createPackage() {
    const wines = await this.wineService.listFull();
    const { data, images } = this.simplify(wines);

    const pack = new WinePackage();
    pack.wineCount = data.length;
    pack.date = new Date();
    pack.size = 0;
    await this.repo.save(pack);

    const { file, size } = await this.compress(data, images, 'paket_v' + pack.id);

    pack.size = size;
    pack.file = file;
    await this.repo.save(pack);
    return pack;
  }

  simplify(wines: Wine[]) {
    const images: { name: string, file: File}[] = [];

    const useImage = (file: File) => {
      const existing = images.find(im => im.file.id == file.id);
      if(existing)
        return existing.name;

      const name = '' + images.length + path.extname(file.key);
      images.push({ name, file });
      return name;
    };

    const data = wines.map(wine => ({
      abv: +wine.abv,
      awards: wine.awards,
      code: wine.code || null,
      culinary: wine.culinary,
      features: wine.features,
      id: wine.id,
      name: wine.name,
      price: +wine.price,
      sugar: wine.sugar.name,
      temperature: wine.temperature,
      type: wine.type.name,
      varieties: (wine.varieties || []).map(variety => ({
        name: variety.name,
        description: variety.description,
        hasLocalOrigins: variety.hasLocalOrigins,
      })),
      volume: +wine.volume,
      winemaker: {
        name: wine.winemaker.name,
        website: wine.winemaker.website,
        images: (wine.winemaker.images || []).map(useImage),
        background: wine.winemaker.background,
        code: wine.winemaker.code,
        place: wine.winemaker.place,
        wines: wine.winemaker.wines,
      },
      year: wine.year || null,
    }));

    return { data, images };
  }

  async compress(jsonData, images: { name: string, file: File}[], name: string) {

    const archive = archiver('zip', { zlib: { level: 9 } });
    const { stream: output, file } = await this.fileService.createWriteStream('.zip', FILE_TYPE.PACKAGE, name);

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function(err) {
      if (err.code === 'ENOENT') {
        console.log(err);
      } else {
        // throw error
        throw err;
      }
    });

    // good practice to catch this error explicitly
    archive.on('error', function(err) {
      throw err;
    });

    // pipe archive data to the file
    archive.pipe(output);

    // package.json
    const buffer = Buffer.from(JSON.stringify(jsonData));
    archive.append(buffer, { name: 'package.json' });

    // images/
    for(let image of images) {
      archive.append(this.fileService.readStream(image.file), { name: 'images/' + image.name });
    }

    const size = new Promise<number>(resolve =>
      output.on('close', function() {
        resolve(archive.pointer());
      })
    );

    archive.finalize();
    return { file, size: await size };
  }
}
