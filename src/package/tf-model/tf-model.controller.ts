import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthGuard } from '../../auth/auth.guard';
import { TFModelService } from './tf-model.service';

@Controller('tf-models')
@UseGuards(AuthGuard)
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
  createNew() {
    return this.tfModelService.start();
  }

}