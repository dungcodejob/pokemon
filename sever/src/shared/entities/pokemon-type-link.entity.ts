import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { PokemonType } from './pokemon-type.entity';
import { Pokemon } from './pokemon.entity';

@Entity()
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

  @Property()
  deleteFlag: boolean = false;

  @Property({ nullable: true })
  deletedAt?: Date;
}
