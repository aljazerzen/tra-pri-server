import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([File])
  ],
  components: [
    FileService,
  ],
  controllers: [
    FileController
  ],
  exports: [
    FileService,
  ]
})
export class FileModule {
}
