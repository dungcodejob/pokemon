import { Account } from '@app/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { FileService } from './file.service';

@Module({
  imports: [MikroOrmModule.forFeature([Account])],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
