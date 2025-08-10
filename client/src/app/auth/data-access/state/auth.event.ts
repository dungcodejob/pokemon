import { eventGroup } from '@ngrx/signals/events';

import { type } from '@ngrx/signals';
import { LoginCredentialsDto } from '../models';
import { AuthTokensDto } from '../models/auth-tokens.dto';

export const authEvents = eventGroup({
  source: 'Auth Page',
  events: {
    login: type<{ credentials: LoginCredentialsDto }>(),
    logout: type<void>(),
    refreshToken: type<{ refreshToken: string }>(),
    initializer: type<void>(),
  },
});

export const authApiEvents = eventGroup({
  source: 'Auth API',
  events: {
    loginSuccess: type<{ tokens: AuthTokensDto }>(),
    loginFailure: type<{ error: unknown }>(),
    refreshTokenSuccess: type<{ tokens: AuthTokensDto }>(),
    refreshTokenFailure: type<{ error: unknown }>(),
  },
});
