import { Controller, Delete, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { TFModelService } from './tf-model.service';

@Controller('tf-models')
export class TFModelController {

  constructor(
    private tfModelService: TFModelService
  ) {
  }

  @Get('stream')
  async attachToCurrentProcess(@Res() res: Response) {
    this.tfModelService.attach(res);  
  }
  
  @Post()
  async createNew() {
    this.tfModelService.generate();
  }

  @Delete()
  async stopGeneration() {
    this.tfModelService.stop();
  }


}