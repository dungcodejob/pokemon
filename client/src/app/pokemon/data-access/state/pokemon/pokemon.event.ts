import { eventGroup } from '@ngrx/signals/events';

import { PaginationDto, PaginationMetaDto } from '@core/http';
import { type } from '@ngrx/signals';
import { PokemonResultDto, PokemonTypeResultDto } from '../../models';
import { PokemonDetailsDto } from '../../models/pokemon-details.dto';
import { PokemonFilterDto } from '../../models/pokemon-filter.dto';

export const pokemonEvents = eventGroup({
  source: 'Pokemon Page',
  events: {
    find: type<{ filter: PokemonFilterDto }>(),

    findOne: type<{ id: string }>(),

    findTypes: type<void>(),

    findFavorites: type<void>(),

    toggleFavorite: type<{ id: string }>(),

    reset: type<void>(),

    setFilter: type<{ filter: PokemonFilterDto }>(),

    setPagination: type<{ pagination: PaginationDto }>(),
    nextPage: type<void>(),
    prevPage: type<void>(),
    setName: type<{ name: string }>(),
    setLegendary: type<{ legendary: boolean }>(),
  },
});

export const pokemonApiEvents = eventGroup({
  source: 'Pokemon API',
  events: {
    findSuccess: type<{
      data: PokemonResultDto[];
      pagination: PaginationMetaDto;
      filter: PokemonFilterDto;
    }>(),
    findFailure: type<{ error: unknown }>(),

    findOneSuccess: type<{ data: PokemonDetailsDto }>(),
    findOneFailure: type<{ error: unknown }>(),

    findTypesSuccess: type<{ data: PokemonTypeResultDto[] }>(),
    findTypesFailure: type<{ error: unknown }>(),

    findFavoritesSuccess: type<{ data: PokemonResultDto[] }>(),
    findFavoritesFailure: type<{ error: unknown }>(),

    toggleFavoriteSuccess: type<{ data: PokemonResultDto }>(),
    toggleFavoriteFailure: type<{ error: unknown }>(),
  },
});
