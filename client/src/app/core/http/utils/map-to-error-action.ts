import { catchError, of, OperatorFunction } from 'rxjs';

export function mapToErrorAction<TErrorAction>(
  errorActionCreator: (error: unknown) => TErrorAction,
): OperatorFunction<unknown, unknown> {
  return catchError((error: unknown) => {
    const errorAction = errorActionCreator(error);

    return of(errorAction);
  });
}
