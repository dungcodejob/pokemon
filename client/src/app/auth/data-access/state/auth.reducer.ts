import { signalStoreFeature, type } from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import { setError, setFulfilled, setPending } from '@shared/utils';
import { authApiEvents, authEvents } from './auth.event';
import { authApiStatusNames, AuthStateWithStatus } from './auth.store';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withAuthReducer() {
  return signalStoreFeature(
    {
      state: type<AuthStateWithStatus>(),
    },
    withReducer(
      on(authEvents.logout, () => ({
        data: null,
        isInitialized: true,
      })),
      on(authEvents.refreshToken, () => ({
        ...setPending(authApiStatusNames.refresh),
      })),
      on(authApiEvents.refreshTokenSuccess, ({ payload }) => ({
        data: payload.data,
        isInitialized: true,
        ...setFulfilled(authApiStatusNames.refresh),
      })),
      on(authApiEvents.refreshTokenFailure, ({ payload }) => ({
        data: null,
        isInitialized: true,
        ...setError(payload.error, authApiStatusNames.refresh),
      })),
      on(authEvents.login, () => ({
        ...setPending(authApiStatusNames.login),
      })),
      on(authApiEvents.loginSuccess, ({ payload }) => ({
        data: payload.data,
        isInitialized: true,
        ...setFulfilled(authApiStatusNames.login),
      })),
      on(authApiEvents.loginFailure, ({ payload }) => ({
        data: null,
        isInitialized: true,
        ...setError(payload.error, authApiStatusNames.login),
      })),
      on(authEvents.register, () => ({
        ...setPending(authApiStatusNames.register),
      })),
      on(authApiEvents.registerSuccess, () => ({
        ...setFulfilled(authApiStatusNames.register),
      })),
      on(authApiEvents.registerFailure, ({ payload }) => ({
        ...setError(payload.error, authApiStatusNames.register),
      })),
    ),
  );
}
