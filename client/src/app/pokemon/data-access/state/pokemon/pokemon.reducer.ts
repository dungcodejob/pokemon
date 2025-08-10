import { signalStoreFeature, type } from '@ngrx/signals';
import { setAllEntities } from '@ngrx/signals/entities';
import { on, withReducer } from '@ngrx/signals/events';
import { setError, setFulfilled, setPending } from '@shared/utils';
import { pokemonApiEvents, pokemonEvents } from './pokemon.event';
import {
  pokemonApiStatusNames,
  PokemonStateWithFeature,
} from './pokemon.store';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withPokemonReducer() {
  return signalStoreFeature(
    {
      state: type<PokemonStateWithFeature>(),
    },
    withReducer(
      on(pokemonEvents.find, () => ({
        ...setPending(pokemonApiStatusNames.find),
      })),
      on(pokemonApiEvents.findSuccess, ({ payload }) => [
        setFulfilled(pokemonApiStatusNames.find),
        setAllEntities(payload.data),
        {
          totalPages: payload.pagination.totalPages,
          totalCount: payload.pagination.totalCount,
          ...payload.filter,
        },
      ]),
      on(pokemonApiEvents.findFailure, ({ payload }) => ({
        ...setError(payload.error, pokemonApiStatusNames.find),
      })),
      on(pokemonEvents.setFilter, ({ payload }) => ({
        ...payload.filter,
      })),
      on(pokemonEvents.setPagination, ({ payload }) => ({
        ...payload.pagination,
      })),
      on(pokemonEvents.setName, ({ payload }) => ({
        ...payload,
      })),
      on(pokemonEvents.import, () => ({
        ...setPending(pokemonApiStatusNames.import),
      })),
      on(pokemonApiEvents.importSuccess, ({ payload }) => ({
        ...setFulfilled(pokemonApiStatusNames.import),
      })),
      on(pokemonApiEvents.importFailure, ({ payload }) => ({
        ...setError(payload.error, pokemonApiStatusNames.import),
      })),
      on(pokemonEvents.setLegendary, ({ payload }) => ({
        ...payload,
      })),
    ),
  );
}
