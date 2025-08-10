import { inject } from '@angular/core';
import { mapToErrorAction, mapToResponseDataAction } from '@core/http';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEffects } from '@ngrx/signals/events';
import { StorageService } from '@shared/services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { exhaustMap } from 'rxjs';
import { PKPokemonApi } from '../pokemon.api';
import { pokemonApiEvents, pokemonEvents } from './pokemon.event';
import { PokemonStateWithFeature } from './pokemon.store';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withPokemonEffects() {
  return signalStoreFeature(
    { state: type<PokemonStateWithFeature>() },
    withEffects(
      (
        store,
        events = inject(Events),
        storageService = inject(StorageService),
        pokemonApi = inject(PKPokemonApi),
        messageService = inject(NzMessageService),
      ) => {
        return {
          find: events.on(pokemonEvents.find).pipe(
            exhaustMap(({ payload }) => {
              return pokemonApi.find(payload.filter).pipe(
                mapToResponseDataAction((result) => {
                  return pokemonApiEvents.findSuccess({ data: result.items });
                }),
                mapToErrorAction((error) =>
                  pokemonApiEvents.findFailure({
                    error,
                  }),
                ),
              );
            }),
          ),
        };
      },
    ),
  );
}
