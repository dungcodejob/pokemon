import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  constructor(protected readonly _em: EntityManager) {}
}
