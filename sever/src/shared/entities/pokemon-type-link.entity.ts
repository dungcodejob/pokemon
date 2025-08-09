import { PokemonTypeLinkRepository } from '@app/repositories';
import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { PokemonType } from './pokemon-type.entity';
import { Pokemon } from './pokemon.entity';

@Entity({ repository: () => PokemonTypeLinkRepository })
export class PokemonTypeLink {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Pokemon)
  pokemon!: Pokemon;

  @ManyToOne(() => PokemonType)
  type!: PokemonType;

  @Property()
  isPrimary!: boolean;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @Property({ default: false })
  deleteFlag?: boolean = false;

  @Property({ nullable: true })
  deletedAt?: Date;

  [EntityRepositoryType]?: PokemonTypeLinkRepository;
}
