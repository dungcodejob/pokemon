import { computed, inject } from '@angular/core';
import { AuthStore, authEvents } from '@auth/data-access';
import { errorToString } from '@core/http';
import {
  signalStore,
  withComputed,
  withMethods,
  withProps,
} from '@ngrx/signals';
import { injectDispatch } from '@ngrx/signals/events';

export const PKRegisterFacade = signalStore(
  withProps(() => ({
    _authStore: inject(AuthStore),
    _dispatch: injectDispatch(authEvents),
  })),
  withComputed(({ _authStore }) => ({
    $isPending: computed(() => _authStore.$isRegisterPending()),
    $errorMessage: computed(() => errorToString(_authStore.$registerError())),
  })),
  withMethods(({ _authStore, _dispatch }) => ({
    register: _dispatch.register,
  })),
);
