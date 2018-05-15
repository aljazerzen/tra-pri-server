import { Controller, FileInterceptor, Post, Delete, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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

  @Delete('files/unused')
  async removeUnused() {
    await this.fileService.removeUnused();
  }
}
