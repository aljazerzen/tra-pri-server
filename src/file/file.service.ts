import { BadRequestException, Component, NotFoundException } from '@nestjs/common';
import { File } from './file.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { FILE_TYPE } from './file.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Component()
export class FileService {

  static UPLOAD_PATH = 'public/uploads';

  static ALLOWED_EXTENSIONS = {
    [FILE_TYPE.IMAGE]: ['.png', '.jpg', '.jpeg'],
    [FILE_TYPE.VIDEO]: ['.mp4'],
  };

  constructor(
    @InjectRepository(File) private repo: Repository<File>) {
  }

  async findMany(ids: number[]): Promise<File[]> {
    if(!ids.length)
      return [];

    const files = await this.repo.createQueryBuilder('file')
      .where('id IN (:...ids)', { ids })
      .getMany();
    if(ids.length > files.length)
      throw new NotFoundException('files');
    return files;
  }

  async saveUpload(upload, type: FILE_TYPE) {
    if (!upload)
      throw new BadRequestException('file missing', 'FILE_MISSING');

    this.isAllowedExtension(upload.originalname, type);

    const file = new File();
    file.key = this.createKey(upload.originalname);
    file.type = type;
    file.url = this.createUrl(file.key);

    await Promise.all([
      new Promise((resolve, reject) => fs.writeFile(
        path.resolve(FileService.UPLOAD_PATH, file.key),
        upload.buffer,
        err => err ? reject(err) : resolve())
      ),
      this.repo.save(file),
    ]);

    return file;
  }

  isAllowedExtension(filename: string, type: FILE_TYPE) {
    const ext = path.extname(filename).toLowerCase();

    if (FileService.ALLOWED_EXTENSIONS[type].indexOf(ext) === -1)
      throw new BadRequestException('file must be one of the following formats: '
        + FileService.ALLOWED_EXTENSIONS[type].join(', '), 'BAD_FILE_EXTENSION');
  }

  createKey(originalName: string) {
    return crypto.createHash('md5').update('' + Math.random()).digest('hex') + path.extname(originalName);
  }

  createUrl(key: string) {
    const port = process.env.API_HOST === 'localhost' ? ':' + process.env.API_PORT : '';
    return `//${process.env.API_HOST}${port}/uploads/${key}`;
  }

  removeUnused() {
    const qb = this.repo.createQueryBuilder('file');

    return qb.delete()
      .where('id NOT IN ' + qb.subQuery()
        .select('DISTINCT "fileId"')
        .from('winemaker_images_file')
        .getQuery()
      )
      .andWhere(`"createdAt" < (current_timestamp - interval '1 day')`)
      .execute();
  }
}
