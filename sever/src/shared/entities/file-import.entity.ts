import { FileImportRepository } from '@app/repositories';
import {
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v6 } from 'uuid';
import { Account } from './account.entity';

export enum ImportType {
  Pokemon = 'pokemon',
}

export enum FileType {
  Csv = 'csv',
  Xlsx = 'xlsx',
}

export enum ImportStatus {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed',
}

@Entity({ repository: () => FileImportRepository })
export class FileImport {
  @PrimaryKey()
  id: string = v6();

  @Property()
  fileName: string;

  @Property()
  originalName: string;

  @Enum(() => ImportType)
  importType: ImportType;

  @Enum(() => FileType)
  fileType: FileType;

  @Enum(() => ImportStatus)
  status: ImportStatus;

  @ManyToOne(() => Account, { nullable: true })
  account?: Account;

  @Property()
  totalRows: number = 0;

  @Property()
  processedRows: number = 0;

  @Property()
  successRows: number = 0;

  @Property()
  failedRows: number = 0;

  @Property({ nullable: true })
  completedAt?: Date;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @Property({ default: false })
  deleteFlag?: boolean = false;

  @Property({ nullable: true })
  deletedAt?: Date;

  [EntityRepositoryType]?: FileImportRepository;

  constructor({
    fileName,
    originalName,
    importType,
    fileType,
    status,
    totalRows,
    processedRows,
    successRows,
    failedRows,
  }: {
    fileName: string;
    originalName: string;
    importType: ImportType;
    fileType: FileType;
    status: ImportStatus;
    totalRows: number;
    processedRows: number;
    successRows: number;
    failedRows: number;
  }) {
    this.fileName = fileName;
    this.originalName = originalName;
    this.importType = importType;
    this.fileType = fileType;
    this.status = status;
    this.totalRows = totalRows;
    this.processedRows = processedRows;
    this.successRows = successRows;
    this.failedRows = failedRows;
  }
}
