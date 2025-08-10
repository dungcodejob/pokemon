import { effect, inject, Injector } from '@angular/core';
import { mapToErrorAction, mapToResponseDataAction } from '@core/http';
import { patchState, signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEffects } from '@ngrx/signals/events';
import { StorageService } from '@shared/services';
import { exhaustMap, map, of } from 'rxjs';
import { AuthTokensDto } from '../models';
import { AuthApi } from './auth.api';
import { authApiEvents, authEvents } from './auth.event';
import { AuthState } from './auth.store';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withAuthEffects() {
  return signalStoreFeature(
    { state: type<AuthState>() },
    withEffects(
      (
        store,
        events = inject(Events),
        storage = inject(StorageService),
        injector = inject(Injector),
        api = inject(AuthApi),
      ) => {
        const storageTokens = storage.use<AuthTokensDto>('auth');

        return {
          login: events.on(authEvents.login).pipe(
            exhaustMap(({ payload }) => {
              return api.login(payload.credentials).pipe(
                mapToResponseDataAction((tokens) =>
                  authApiEvents.loginSuccess({ tokens }),
                ),
                mapToErrorAction((error) =>
                  authApiEvents.loginFailure({
                    error,
                  }),
                ),
              );
            }),
          ),

          refreshToken: events.on(authEvents.refreshToken).pipe(
            exhaustMap(({ payload }) => {
              return api.refresh(payload.refreshToken).pipe(
                mapToResponseDataAction((tokens) =>
                  authApiEvents.refreshTokenSuccess({ tokens }),
                ),
                mapToErrorAction((error) =>
                  of(
                    authApiEvents.refreshTokenFailure({
                      error,
                    }),
                  ),
                ),
              );
            }),
          ),

          initializer: events.on(authEvents.initializer).pipe(
            map(() => {
              const localTokens = storageTokens.get();
              if (localTokens) {
                patchState(store, { tokens: localTokens });
              }

              effect(
                () => {
                  const tokens = store.tokens();
                  storageTokens.set(tokens);
                },
                { injector },
              );

              if (localTokens) {
                return authEvents.refreshToken({
                  refreshToken: localTokens.refreshToken,
                });
              } else {
                return authEvents.logout();
              }
            }),
          ),
        };
      },
    ),
  );
}
