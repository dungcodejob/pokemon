import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { authEvents, AuthStore } from '@auth/data-access';
import { injectDispatch } from '@ngrx/signals/events';
import { API_ENDPOINTS } from '@shared/constants';
import {
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authStore = inject(AuthStore);
  const authDispatcher = injectDispatch(authEvents);
  const data = authStore.data();

  const exceptions = [
    API_ENDPOINTS.AUTH.LOGIN,
    API_ENDPOINTS.AUTH.REFRESH,
    API_ENDPOINTS.AUTH.REGISTER,
    API_ENDPOINTS.ASSETS,
    API_ENDPOINTS.CONFIGURATION,
  ];

  const addTokenToRequest = (
    request: HttpRequest<unknown>,
    next: HttpHandlerFn,
    accessToken: string,
  ): Observable<HttpEvent<unknown>> => {
    const headers = request.headers.set(
      'Authorization',
      `Bearer ${accessToken}`,
    );
    const requestClone = request.clone({ headers });

    return next(requestClone);
  };

  const handle401Error = (
    request: HttpRequest<unknown>,
    next: HttpHandlerFn,
    refreshToken: string,
    error: HttpErrorResponse,
  ) => {
    const refreshing = authStore.$isRefreshPending();

    if (refreshing) {
      authDispatcher.refreshToken({ refreshToken });
    }

    return toObservable(authStore.data).pipe(
      filter(Boolean),
      filter(() => !refreshing),
      take(1),
      switchMap((value) => addTokenToRequest(request, next, value.accessToken)),
      catchError(() => throwError(() => error)),
    );
  };

  if (!data) {
    return next(request);
  }

  if (exceptions.some((d) => request.url.includes(d))) {
    return next(request);
  }

  if (request.headers.has('Authorization')) {
    return next(request);
  }

  return addTokenToRequest(request, next, data.accessToken).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === HttpStatusCode.Unauthorized &&
        !exceptions.some((d) => request.url.includes(d))
      ) {
        if (!data.refreshToken) {
          return throwError(() => error);
        }

        return handle401Error(request, next, data.refreshToken, error);
      } else {
        return throwError(() => error);
      }
    }),
  );
};
