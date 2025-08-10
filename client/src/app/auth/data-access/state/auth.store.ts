import { signalStore, withState } from '@ngrx/signals';
import { NamedStatusState, withStatus } from '@shared/utils';
import { AuthResultDto } from '../models/auth-result.dto';
import { withAuthEffects } from './auth.effects';
import { withAuthReducer } from './auth.reducer';

export type AuthState = {
  data: AuthResultDto | null;
  isInitialized: boolean;
};

export const authApiStatusNames = {
  login: 'login',
  refresh: 'refresh',
  register: 'register',
} as const;

export type AuthStateWithStatus = AuthState &
  NamedStatusState<typeof authApiStatusNames.login> &
  NamedStatusState<typeof authApiStatusNames.refresh> &
  NamedStatusState<typeof authApiStatusNames.register>;

export const authInitialState: AuthState = {
  data: null,
  isInitialized: false,
};

export const AuthStore = signalStore(
  withState(authInitialState),
  withStatus({
    names: [
      authApiStatusNames.login,
      authApiStatusNames.refresh,
      authApiStatusNames.register,
    ],
  }),
  withAuthReducer(),
  withAuthEffects(),
);
