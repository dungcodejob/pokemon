import { PokemonFavorite } from '@app/entities';
import { EntityRepository } from '@mikro-orm/core';

export class PokemonFavoriteRepository extends EntityRepository<PokemonFavorite> {}
