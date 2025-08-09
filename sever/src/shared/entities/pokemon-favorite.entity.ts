import { PokemonFavoriteRepository } from '@app/repositories';
import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v6 } from 'uuid';
import { Pokemon } from './pokemon.entity';
import { User } from './user.entity';

@Entity({ repository: () => PokemonFavoriteRepository })
@Unique({ properties: ['user', 'pokemon'] })
export class PokemonFavorite {
  @PrimaryKey()
  id: string = v6();

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Pokemon)
  pokemon: Pokemon;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ default: false })
  deleteFlag?: boolean = false;

  @Property({ nullable: true })
  deletedAt?: Date;

  [EntityRepositoryType]?: PokemonFavoriteRepository;
}
