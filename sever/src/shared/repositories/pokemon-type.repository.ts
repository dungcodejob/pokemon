import { PokemonType } from '@app/entities';
import { EntityRepository } from '@mikro-orm/core';

export class PokemonTypeRepository extends EntityRepository<PokemonType> {}
