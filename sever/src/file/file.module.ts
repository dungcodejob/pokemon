import { Account } from '@app/entities';
import { provideUnitOfWork } from '@app/repositories';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { FileService } from './file.service';

@Module({
  imports: [MikroOrmModule.forFeature([Account])],
  providers: [FileService, provideUnitOfWork()],
  exports: [FileService],
})
export class FileModule {}
