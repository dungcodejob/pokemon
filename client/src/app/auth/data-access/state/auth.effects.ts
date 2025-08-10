import { effect, inject, Injector } from '@angular/core';
import { mapToErrorAction, mapToResponseDataAction } from '@core/http';
import { patchState, signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEffects } from '@ngrx/signals/events';
import { RedirectService, StorageService } from '@shared/services';
import { exhaustMap, map, of, tap } from 'rxjs';
import { AuthResultDto } from '../models';
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
        storageService = inject(StorageService),
        injector = inject(Injector),
        authApi = inject(AuthApi),
        redirectService = inject(RedirectService),
      ) => {
        const storageTokens = storageService.use<AuthResultDto>('auth');

        return {
          login: events.on(authEvents.login).pipe(
            exhaustMap(({ payload }) => {
              return authApi.login(payload.credentials).pipe(
                mapToResponseDataAction((result) =>
                  authApiEvents.loginSuccess({ data: result.data }),
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
              return authApi.refresh(payload.refreshToken).pipe(
                mapToResponseDataAction((result) =>
                  authApiEvents.refreshTokenSuccess({ data: result.data }),
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
                patchState(store, { data: localTokens });
              }

              effect(
                () => {
                  const data = store.data();
                  storageTokens.set(data);
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

          redirect: events
            .on(authApiEvents.loginSuccess, authApiEvents.refreshTokenSuccess)
            .pipe(
              tap(() => {
                redirectService.redirectToSavedUrl();
              }),
            ),
        };
      },
    ),
  );
}
