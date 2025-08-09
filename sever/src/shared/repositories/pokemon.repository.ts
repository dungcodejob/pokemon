import { Pokemon } from '@app/entities';
import { EntityRepository } from '@mikro-orm/core';

export class PokemonRepository extends EntityRepository<Pokemon> {}
