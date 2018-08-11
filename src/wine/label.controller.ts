import { Body, Controller, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { DWineLabels, DWineLabelSummary } from '../wine/wine.dto';
import { WineService } from '../wine/wine.service';

@Controller('labels')
@UseGuards(AuthGuard)
export class LabelController {

  constructor(
    private service: WineService,
  ) {
  }

  @Get()
  async list() {
    const wines = await this.service.list(['winemaker'], true);
    await this.service.loadLabelCount(wines);
    
    return DWineLabelSummary.createList(wines);
  }

  @Get(':wineId')
  async get(@Param('wineId', new ParseIntPipe()) wineId: number) {
    let wine = await this.service.get(wineId, ['winemaker', 'labels', 'labels.image']);
    return DWineLabels.create(wine);
  }

  @Put(':wineId')
  async update(@Body() data: DWineLabels, @Param('wineId', new ParseIntPipe()) wineId: number) {
    let wine = await this.service.get(wineId, ['winemaker', 'labels', 'labels.image']);
    wine = await this.service.updateLabelImages(wine, data);
    return DWineLabels.create(wine);
  }
}
