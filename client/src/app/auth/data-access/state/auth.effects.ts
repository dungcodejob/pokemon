import { effect, inject, Injector } from '@angular/core';
import { mapToErrorAction, mapToResponseDataAction } from '@core/http';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEffects } from '@ngrx/signals/events';
import { RedirectService, StorageService } from '@shared/services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EMPTY, exhaustMap, map, tap } from 'rxjs';
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
        messageService = inject(NzMessageService),
      ) => {
        const storageTokens = storageService.use<AuthResultDto>('auth');

        return {
          login: events.on(authEvents.login).pipe(
            exhaustMap(({ payload }) => {
              return authApi.login(payload.credentials).pipe(
                mapToResponseDataAction((result) => {
                  messageService.success('Login successful', {
                    nzDuration: 3000,
                  });
                  return authApiEvents.loginSuccess({ data: result.data });
                }),
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
                  authApiEvents.refreshTokenFailure({
                    error,
                  }),
                ),
              );
            }),
          ),

          register: events.on(authEvents.register).pipe(
            exhaustMap(({ payload }) => {
              return authApi.register(payload.credentials).pipe(
                mapToResponseDataAction(() => {
                  messageService.success('Register successful', {
                    nzDuration: 3000,
                  });
                  return authApiEvents.registerSuccess();
                }),
                mapToErrorAction((error) =>
                  authApiEvents.registerFailure({
                    error,
                  }),
                ),
              );
            }),
          ),

          initializer: events.on(authEvents.initializer).pipe(
            map(() => {
              const localTokens = storageTokens.get();

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

          redirectToSavedUrl: events
            .on(authApiEvents.loginSuccess, authApiEvents.refreshTokenSuccess)
            .pipe(
              tap(() => {
                redirectService.redirectToSavedUrl();
              }),
              map(() => EMPTY),
            ),

          redirectToLogin: events
            .on(authEvents.logout, authApiEvents.registerSuccess)
            .pipe(
              tap(() => redirectService.redirectToLogin()),
              map(() => EMPTY),
            ),

          logout: events
            .on(authApiEvents.refreshTokenFailure)
            .pipe(map(() => authEvents.logout())),
        };
      },
    ),
  );
}
