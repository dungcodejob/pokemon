import { PokemonTypeRepository } from '@app/repositories';
import {
  Cascade,
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v6 } from 'uuid';
import { FileImport } from './file-import.entity';
import { Pokemon } from './pokemon.entity';

@Entity({ repository: () => PokemonTypeRepository })
export class PokemonType {
  @PrimaryKey()
  id: string = v6();

  @Property()
  name: string;

  @ManyToMany(() => Pokemon, (pokemon) => pokemon.types, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
    mappedBy: 'types',
  })
  pokemons = new Collection<Pokemon>(this);

  @ManyToOne(() => FileImport, { nullable: true })
  importedFrom?: FileImport;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @Property({ default: false })
  deleteFlag?: boolean = false;

  @Property({ nullable: true })
  deletedAt?: Date;

  [EntityRepositoryType]?: PokemonTypeRepository;

  constructor({ name }: { name: string }) {
    this.name = name;
  }
}
