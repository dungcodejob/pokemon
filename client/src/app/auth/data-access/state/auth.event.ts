import { eventGroup } from '@ngrx/signals/events';

import { type } from '@ngrx/signals';
import { LoginCredentialsDto, RegisterDto } from '../models';
import { AuthResultDto } from '../models/auth-result.dto';

export const authEvents = eventGroup({
  source: 'Auth Page',
  events: {
    login: type<{ credentials: LoginCredentialsDto }>(),
    logout: type<void>(),
    refreshToken: type<{ refreshToken: string }>(),
    register: type<{ credentials: RegisterDto }>(),
    initializer: type<void>(),
  },
});

export const authApiEvents = eventGroup({
  source: 'Auth API',
  events: {
    loginSuccess: type<{ data: AuthResultDto }>(),
    loginFailure: type<{ error: unknown }>(),
    refreshTokenSuccess: type<{ data: AuthResultDto }>(),
    refreshTokenFailure: type<{ error: unknown }>(),
    registerSuccess: type<void>(),
    registerFailure: type<{ error: unknown }>(),
  },
});
