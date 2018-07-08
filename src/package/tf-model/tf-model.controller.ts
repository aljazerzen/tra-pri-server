import { Controller, FileFieldsInterceptor, Get, Header, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';

import { FILE_TYPE } from '../../file/file.constants';
import { FileService } from '../../file/file.service';
import { TFModelService } from './tf-model.service';

@Controller('tf-models')
// @UseGuards(AuthGuard)
export class TFModelController {

  constructor(
    private tfModelService: TFModelService,
    private fileService: FileService,
  ) {
  }

  @Get('stream')
  async attachToCurrentProcess(@Res() res: Response) {
    this.tfModelService.attach(res);  
  }
  
  @Post()
  generateNew() {
    return this.tfModelService.start();
  }

  @Post('manual')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'model', maxCount: 1 } , { name: 'label_map', maxCount: 1 }]))
  async uploadManual(@UploadedFiles() files) {
    await this.fileService.saveUpload(files.model[0], FILE_TYPE.MODEL, null, this.tfModelService.createModelFilename());

    return this.tfModelService.loadLabelMap(files.label_map[0].buffer);
  }

  @Get('manual')
  @Header('Content-Disposition', 'attachment; filename="model_input.zip"')
  async prepareManual(@Res() res: Response) {
    await this.tfModelService.prepareModelInput();

    this.tfModelService.zipModelInput(res);
  }

}