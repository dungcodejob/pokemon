import { PokemonRepository } from '@app/repositories';
import {
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
import { PokemonType } from './pokemon-type.entity';

@Entity({ repository: () => PokemonRepository })
export class Pokemon {
  @PrimaryKey()
  id: string = v6();

  @Property()
  name: string;

  @ManyToMany(() => PokemonType)
  types = new Collection<PokemonType>(this);

  @ManyToOne(() => FileImport, { nullable: true })
  importedFrom?: FileImport;

  @Property()
  total: number;

  @Property()
  hp: number;

  @Property()
  attack: number;

  @Property()
  defense: number;

  @Property()
  spAttack: number;

  @Property()
  spDefense: number;

  @Property()
  speed: number;

  @Property()
  generation: number;

  @Property()
  legendary: boolean;

  @Property({ nullable: true })
  image?: string;

  @Property({ nullable: true })
  ytbUrl?: string;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ default: false })
  deleteFlag?: boolean = false;

  @Property({ nullable: true })
  deletedAt?: Date;

  [EntityRepositoryType]?: PokemonRepository;

  constructor({
    name,
    total,
    hp,
    attack,
    defense,
    spAttack,
    spDefense,
    speed,
    generation,
    legendary,
    image,
    ytbUrl,
  }: {
    name: string;
    total: number;
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
    generation: number;
    legendary: boolean;
    image?: string;
    ytbUrl?: string;
  }) {
    this.name = name;
    this.total = total;
    this.hp = hp;
    this.attack = attack;
    this.defense = defense;
    this.spAttack = spAttack;
    this.spDefense = spDefense;
    this.speed = speed;
    this.generation = generation;
    this.legendary = legendary;
    this.image = image;
    this.ytbUrl = ytbUrl;
  }
}
