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
        tokens: null,
        isInitialized: true,
      })),
      on(authEvents.refreshToken, () => ({
        ...setPending(authApiStatusNames.refresh),
      })),
      on(authApiEvents.refreshTokenSuccess, ({ payload }) => ({
        tokens: payload.tokens,
        isInitialized: true,
        ...setFulfilled(authApiStatusNames.refresh),
      })),
      on(authApiEvents.refreshTokenFailure, ({ payload }) => ({
        tokens: null,
        isInitialized: true,
        ...setError(payload.error, authApiStatusNames.refresh),
      })),
      on(authEvents.login, () => ({
        ...setPending(authApiStatusNames.login),
      })),
      on(authApiEvents.loginSuccess, ({ payload }) => ({
        tokens: payload.tokens,
        isInitialized: true,
        ...setFulfilled(authApiStatusNames.login),
      })),
      on(authApiEvents.loginFailure, ({ payload }) => ({
        tokens: null,
        isInitialized: true,
        ...setError(payload.error, authApiStatusNames.login),
      })),
    ),
  );
}
