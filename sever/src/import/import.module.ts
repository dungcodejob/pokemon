import { FileImport } from '@app/entities';
import { provideUnitOfWork } from '@app/repositories';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ImportService } from './import.service';

@Module({
  imports: [MikroOrmModule.forFeature([FileImport])],
  providers: [ImportService, provideUnitOfWork()],
  exports: [ImportService],
})
export class ImportModule {}
