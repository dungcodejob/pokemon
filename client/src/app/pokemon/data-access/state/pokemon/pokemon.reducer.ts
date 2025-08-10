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
      ]),
      on(pokemonApiEvents.findFailure, ({ payload }) => ({
        ...setError(payload.error, pokemonApiStatusNames.find),
      })),
    ),
  );
}
