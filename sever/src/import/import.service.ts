import { FileImport, FileType, ImportStatus, ImportType } from '@app/entities';
import {
  FileImportValidatorErrorDto,
  FileImportValidatorException,
} from '@app/models';
import { UNIT_OF_WORK, type UnitOfWork } from '@app/repositories';
import { Inject, Injectable, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import csvParser from 'csv-parser';
import { createReadStream } from 'fs';

@Injectable()
export class ImportService {
  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly _unitOfWork: UnitOfWork,
  ) {}

  async createFileImport(
    file: Express.Multer.File,
    accountId: string,
    importType: ImportType,
  ) {
    const account = this._unitOfWork.account.getReference(accountId);
    const fileImport = new FileImport({
      fileName: file.filename,
      originalName: file.originalname,
      importType,
      fileType: FileType.Csv,
      status: ImportStatus.Pending,
      totalRows: 0,
      failedRows: 0,
      processedRows: 0,
      successRows: 0,
    });

    fileImport.account = account;
    return this._unitOfWork.fileImport.create(fileImport);
  }

  flush(): Promise<void> {
    return this._unitOfWork.save();
  }

  async validateRowData<T>(
    data: unknown[],
    dto: Type<T>,
  ): Promise<{
    data: T[];
    errors: FileImportValidatorErrorDto[];
  }> {
    const validatedData: any[] = [];
    const errors: FileImportValidatorErrorDto[] = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const instance = plainToInstance(dto, item);

      const validationErrors = await validate(instance as object);
      if (validationErrors.length > 0) {
        errors.push(
          ...validationErrors.map((error) => ({
            index: i + 1,
            property: error.property,
            constraints: error.constraints,
          })),
        );
      } else {
        validatedData.push(instance);
      }
    }

    if (errors.length > 0) {
      throw new FileImportValidatorException(errors.splice(0, 10));
    }

    return {
      data: validatedData,
      errors,
    };
  }

  async parseCsvFile<T>(
    file: Express.Multer.File,
    options: csvParser.Options,
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const results: T[] = [];

      createReadStream(file.path)
        .pipe(csvParser(options))
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }
}
