import { PokemonTypeRepository } from '@app/repositories';
import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v6 } from 'uuid';

@Entity({ repository: () => PokemonTypeRepository })
export class PokemonType {
  @PrimaryKey()
  id: string = v6();

  @Property()
  name: string;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @Property()
  deleteFlag: boolean = false;

  @Property({ nullable: true })
  deletedAt?: Date;

  [EntityRepositoryType]?: PokemonTypeRepository;

  constructor({ name }: { name: string }) {
    this.name = name;
  }
}
