import { Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PackageService } from './package.service';
import { DPackage } from './package.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('packages')
export class PackageController {

  constructor(private packageService: PackageService) {
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

  @Post()
  @UseGuards(AuthGuard)
  async createNewPackage() {
    const pack = await this.packageService.createPackage();
    return DPackage.create(pack);
  }

}
