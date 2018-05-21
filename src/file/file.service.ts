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
    [FILE_TYPE.VIDEO]: ['.mp4', '.webm'],
  };

  constructor(
    @InjectRepository(File) private repo: Repository<File>,
  ) {
  }

  async findMany(ids: number[]): Promise<File[]> {
    if (!ids.length)
      return [];

    const files = await this.repo.createQueryBuilder('file')
      .where('id IN (:...ids)', { ids })
      .getMany();
    if (ids.length > files.length)
      throw new NotFoundException('files');
    return files;
  }

  async get(id: number): Promise<File> {
    const file = await this.repo.findOne(id);
    if (!file)
      throw new NotFoundException('files');
    return file;
  }

  async saveUpload(upload, type: FILE_TYPE) {
    if (!upload)
      throw new BadRequestException('file missing', 'FILE_MISSING');

    const extension = this.isAllowedExtension(upload.originalname, type);

    const { stream, file } = await this.createWriteStream(extension, type);
    await new Promise(resolve => stream.write(upload.buffer, resolve));
    return file;
  }

  async createWriteStream(extension: string, type: FILE_TYPE, key?: string) {
    const file = new File();
    file.type = type;
    file.key = key ? key + extension : this.createKey(extension);
    file.url = this.createUrl(file.key);
    await this.repo.save(file);

    const stream = fs.createWriteStream(path.resolve(FileService.UPLOAD_PATH, file.key));
    return { stream, file };
  }

  readStream(file: File) {
    return fs.createReadStream(path.resolve(FileService.UPLOAD_PATH, file.key));
  }

  isAllowedExtension(filename: string, type: FILE_TYPE) {
    const ext = path.extname(filename).toLowerCase();

    if (FileService.ALLOWED_EXTENSIONS[type].indexOf(ext) === -1)
      throw new BadRequestException('file must be one of the following formats: '
        + FileService.ALLOWED_EXTENSIONS[type].join(', '), 'BAD_FILE_EXTENSION');

    return ext;
  }

  createKey(extension: string = '') {
    return crypto.createHash('md5').update('' + Math.random()).digest('hex') + extension;
  }

  createUrl(key: string) {
    const port = process.env.API_HOST === 'localhost' ? ':' + process.env.API_PORT : '';
    return `//${process.env.API_HOST}${port}/uploads/${key}`;
  }

  async remove(files: File[]) {
    for (let file of files) {
      await new Promise(resolve => fs.unlink(path.resolve(FileService.UPLOAD_PATH, file.key), resolve));
    }

    await this.repo.remove(files);
  }

  getUnused() {
    const qb = this.repo.createQueryBuilder('file');

    return qb
      .where('id NOT IN ' + qb.subQuery()
        .select('DISTINCT "fileId"')
        .from('winemaker_images_file', 'winemaker_images')
        .getQuery()
      )
      .andWhere('id NOT IN ' + qb.subQuery()
        .select('"fileId"')
        .from('wine_package', 'wine_package')
        .getQuery()
      )
      .andWhere(`"createdAt" < (current_timestamp - interval '1 day')`)
      .getMany();
  }
}
