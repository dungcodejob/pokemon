import { HttpErrorResponse } from '@angular/common/http';
import { ObjectValues } from '@shared/utils';
import { PKApiError } from '../models/api-error';

export const DEFAULT_ERROR_MESSAGE =
  'Something went wrong. Please try again later or contact support if the problem persists.';

const errorCodes = {
  AuthEmailAlreadyExists: 'Auth.EmailAlreadyExists',
  AuthInvalidEmailOrUsername: 'Auth.InvalidEmailOrUsername',
  AuthInvalidCredentials: 'Auth.InvalidCredentials',
  AuthInvalidToken: 'Auth.InvalidToken',
  AuthInvalidRefreshToken: 'Auth.InvalidRefreshToken',
} as const;

type ErrorCodes = ObjectValues<typeof errorCodes>;

const authenticationErrorMessages = {
  [errorCodes.AuthEmailAlreadyExists]:
    'This email is already registered. Please use a different email or log in.',
  [errorCodes.AuthInvalidEmailOrUsername]:
    'Invalid email or username. Please check and try again.',
  [errorCodes.AuthInvalidCredentials]:
    'Invalid credentials. Please check your email and password and try again.',
  [errorCodes.AuthInvalidToken]:
    'Invalid token. Please try again or log in again.',
  [errorCodes.AuthInvalidRefreshToken]:
    'Invalid refresh token. Please try again or log in again.',
} as const;

export function errorToString(error: unknown): string {
  if (!error) {
    return '';
  }

  let message = DEFAULT_ERROR_MESSAGE;
  if (PKApiError.is(error)) {
    const errorCode = error.data?.errorCode as ErrorCodes;
    message = authenticationErrorMessages[errorCode] || error.message;
  } else if (error instanceof HttpErrorResponse) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }
  return message;
}
