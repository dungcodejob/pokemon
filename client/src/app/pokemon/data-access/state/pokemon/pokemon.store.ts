import { signalStore, withState } from '@ngrx/signals';
import { EntityState, withEntities } from '@ngrx/signals/entities';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from '@shared/constants/default-values.constants';
import { NamedStatusState, withStatus } from '@shared/utils';
import {
  PokemonResultDto,
  PokemonSortField,
  PokemonTypeResultDto,
  SortOrder,
} from '../../models';
import { withPokemonEffects } from './pokemon.effects';
import { withPokemonReducer } from './pokemon.reducer';

export type PokemonState = {
  types: PokemonTypeResultDto[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  sortBy: PokemonSortField | null;
  sortOrder: SortOrder | null;
  name: string;
  legendary: boolean;
  typeIds: string[] | null;
};

export const pokemonApiStatusNames = {
  find: 'find',
  findOne: 'findOne',
  findTypes: 'findTypes',
  findFavorites: 'findFavorites',
  toggleFavorite: 'toggleFavorite',
  import: 'import',
} as const;

export type PokemonStateWithFeature = PokemonState &
  NamedStatusState<typeof pokemonApiStatusNames.find> &
  NamedStatusState<typeof pokemonApiStatusNames.findOne> &
  NamedStatusState<typeof pokemonApiStatusNames.findTypes> &
  NamedStatusState<typeof pokemonApiStatusNames.findFavorites> &
  NamedStatusState<typeof pokemonApiStatusNames.toggleFavorite> &
  NamedStatusState<typeof pokemonApiStatusNames.import> &
  EntityState<PokemonResultDto>;

export const pokemonInitialState: PokemonStateWithFeature = {
  types: [],
  findStatus: { error: null },
  findOneStatus: { error: null },
  findTypesStatus: { error: null },
  findFavoritesStatus: { error: null },
  toggleFavoriteStatus: { error: null },
  importStatus: { error: null },
  entityMap: {},
  ids: [],
  name: '',
  legendary: false,
  totalPages: 0,
  totalCount: 0,
  currentPage: DEFAULT_PAGE_NUMBER,
  pageSize: DEFAULT_PAGE_SIZE,
  typeIds: null,
  sortBy: null,
  sortOrder: null,
};

export const PKPokemonStore = signalStore(
  withState<PokemonStateWithFeature>(pokemonInitialState),
  withEntities<PokemonResultDto>(),
  withStatus({
    names: [
      pokemonApiStatusNames.find,
      pokemonApiStatusNames.findOne,
      pokemonApiStatusNames.findTypes,
      pokemonApiStatusNames.findFavorites,
      pokemonApiStatusNames.toggleFavorite,
      pokemonApiStatusNames.import,
    ],
  }),
  withPokemonEffects(),
  withPokemonReducer(),
);
