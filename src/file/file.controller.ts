import {
  Controller,
  FileInterceptor,
  Post,
  Delete,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Get
} from '@nestjs/common';
import { FileService } from './file.service';
import { FILE_TYPE } from './file.constants';
import { DFile } from './file.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class FileController {

  constructor(
    private fileService: FileService
  ) {
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() upload) {
    const entity = await this.fileService.saveUpload(upload, FILE_TYPE.IMAGE);
    return DFile.create(entity);
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  async video(@UploadedFile() upload) {
    const entity = await this.fileService.saveUpload(upload, FILE_TYPE.VIDEO);
    return DFile.create(entity);
  }

  @Get('files/unused')
  async listUnused() {
    return this.fileService.getUnused();
  }

  @Delete('files/unused')
  async removeUnused() {
    const files = await this.fileService.getUnused();
    await this.fileService.remove(files);
    return { deleted: files.length };
  }
}
