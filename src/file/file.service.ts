import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { Readable } from 'stream';
import { Repository } from 'typeorm';

import { FILE_TYPE } from './file.constants';
import { File } from './file.entity';

@Injectable()
export class FileService {

  static UPLOAD_PATH = 'public/uploads';

  static ALLOWED_EXTENSIONS = {
    [FILE_TYPE.IMAGE]: ['.png', '.jpg', '.jpeg'],
    [FILE_TYPE.VIDEO]: ['.mp4', '.webm'],
    [FILE_TYPE.MODEL]: ['.pb'],
  };

  constructor(
    @InjectRepository(File) private repo: Repository<File>,
  ) {
  }

  toStream(buffer: Buffer) {
    const r = new Readable();
    r._read = () => { };
    r.push(buffer);
    r.push(null);
    return r;
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

  async saveUpload(upload, type: FILE_TYPE, resize?: { width: number, height: number }, filename?: string) {
    if (!upload)
      throw new BadRequestException('file missing', 'FILE_MISSING');

    const extension = this.isAllowedExtension(upload.originalname, type);

    const stream = resize
      ? this.resize(upload.buffer, resize)
      : (type === FILE_TYPE.IMAGE ? this.removeEXIF(upload.buffer) : this.toStream(upload.buffer));

    return this.save(stream, type, extension, filename);
  }

  removeEXIF(buffer: Buffer) {
    return sharp(buffer).rotate();
  }

  resize(buffer: Buffer, size: { width: number, height: number }) {
    return sharp(buffer).resize(size.width, size.height).max().rotate();
  }

  async save(stream: Readable, type: FILE_TYPE, extension?: string, path?: string) {
    const file = new File();
    file.type = type;
    file.path = path || this.createKey(extension);
    file.url = this.createUrl(file.path);
    await this.repo.save(file);

    await new Promise(resolve => {
      stream
        .pipe(fs.createWriteStream(this.getPath(file)))
        .on('finish', resolve);
    });
    return file;
  }

  async importLocalFile(type: FILE_TYPE, current_path: string, new_filename: string) {
    const file = new File();
    file.type = type;
    file.path = current_path;

    await this.move(file, path.resolve(FileService.UPLOAD_PATH, new_filename));
    return file;
  }

  readStream(file: File) {
    return fs.createReadStream(this.getPath(file));
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
    if (path.isAbsolute(key))
      return null;
    return `${process.env.API_URL}/uploads/${key}`;
  }

  getPath(file: File) {
    return path.resolve(FileService.UPLOAD_PATH, file.path);
  }

  async remove(files: File[]) {
    for (let file of files) {
      await new Promise(resolve => fs.unlink(this.getPath(file), resolve));
    }

    await this.repo.remove(files);
  }

  async move(file: File, newPath?: string) {
    await new Promise(resolve =>
      fs.rename(this.getPath(file), newPath, resolve)
    );

    file.path = path.relative(FileService.UPLOAD_PATH, newPath);
    file.url = this.createUrl(file.path);
    await this.repo.save(file);
  }

  async createLink(file: File, path: string) {
    await new Promise(resolve =>
      fs.link(this.getPath(file), path, resolve)
    );
  }

  async getLastOfType(type: FILE_TYPE) {
    const model = await this.repo.findOne({ where: { type }, order: { createdAt: 'DESC' } });
    return model;
  }

  getUnused() {
    const qb = this.repo.createQueryBuilder('file');

    return qb
      .where('id NOT IN ' + qb.subQuery()
        .select('DISTINCT "fileId"')
        .from('winemaker_images_file', 'winemaker_images')
        .where('"fileId" IS NOT NULL')
        .getQuery()
      )
      .andWhere('id NOT IN ' + qb.subQuery()
        .select('"videoId"')
        .from('winemaker', 'winemaker')
        .where('"videoId" IS NOT NULL')
        .getQuery()
      )
      .andWhere('id NOT IN ' + qb.subQuery()
        .select('DISTINCT "fileId"')
        .from('variety_images_file', 'variety_images')
        .where('"fileId" IS NOT NULL')
        .getQuery()
      )
      .andWhere('id NOT IN ' + qb.subQuery()
        .select('DISTINCT "fileId"')
        .from('wine_images_file', 'wine_images')
        .where('"fileId" IS NOT NULL')
        .getQuery()
      )
      .andWhere('id NOT IN ' + qb.subQuery()
        .select('"fileId"')
        .from('wine_package', 'wine_package')
        .where('"fileId" IS NOT NULL')
        .getQuery()
      )
      .andWhere('id NOT IN ' + qb.subQuery()
        .select('"imageId"')
        .from('label', 'label')
        .where('"imageId" IS NOT NULL')
        .getQuery()
      )
      .andWhere('id NOT IN ' + qb.subQuery()
        .select('"modelId"')
        .from('wine_package', 'wine_package')
        .where('"modelId" IS NOT NULL')
        .getQuery()
      )
      .andWhere('id NOT IN ' + qb.subQuery()
        .select('"jsonId"')
        .from('wine_package', 'wine_package')
        .where('"jsonId" IS NOT NULL')
        .getQuery()
      )
      .andWhere(`"createdAt" < (current_timestamp - interval '1 day')`)
      .getMany();
  }

  getUsedForContentCount() {
    const qb = this.repo.createQueryBuilder('file');

    return qb
      .where('id IN ' + qb.subQuery()
        .select('DISTINCT "fileId"')
        .from('winemaker_images_file', 'winemaker_images')
        .where('"fileId" IS NOT NULL')
        .getQuery()
      )
      .orWhere('id IN ' + qb.subQuery()
        .select('"videoId"')
        .from('winemaker', 'winemaker')
        .where('"videoId" IS NOT NULL')
        .getQuery()
      )
      .orWhere('id IN ' + qb.subQuery()
        .select('DISTINCT "fileId"')
        .from('variety_images_file', 'variety_images')
        .where('"fileId" IS NOT NULL')
        .getQuery()
      )
      .orWhere('id IN ' + qb.subQuery()
        .select('DISTINCT "fileId"')
        .from('wine_images_file', 'wine_images')
        .where('"fileId" IS NOT NULL')
        .getQuery()
      )
      .getCount();
  }
}
