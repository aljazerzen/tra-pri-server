import { Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { FILE_TYPE } from '../file/file.constants';
import { FileService } from '../file/file.service';
import { WineService } from '../wine/wine.service';
import { WinemakerService } from '../winemaker/winemaker.service';
import { DPackage, DReadyResources } from './package.dto';
import { PackageService } from './package.service';

@Controller('packages')
export class PackageController {

  constructor(
    private packageService: PackageService,
    private wineService: WineService,
    private winemakerService: WinemakerService,
    private fileService: FileService,
  ) {
  }

  @Get('active')
  async getActive() {
    const pack = await this.packageService.getActive();
    return DPackage.create(pack);
  }

  @Get()
  @UseGuards(AuthGuard)
  async list() {
    const packs = await this.packageService.list();
    return DPackage.createList(packs);
  }

  @Put(':packageId')
  @UseGuards(AuthGuard)
  async setActive(@Param('packageId', new ParseIntPipe()) packageId: number) {
    await this.packageService.setActive(packageId);
  }

  @Get('ready')
  @UseGuards(AuthGuard)
  async getReadyResources() {
    return new DReadyResources(
      await this.wineService.getCount(),
      await this.winemakerService.getCount(),
      await this.fileService.getUsedForContentCount(),
      await this.fileService.getLastOfType(FILE_TYPE.MODEL),
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  async createNewPackage() {
    const pack = await this.packageService.createPackage();
    return DPackage.create(pack);
  }

}
