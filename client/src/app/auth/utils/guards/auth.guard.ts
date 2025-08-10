import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthStore } from '@auth/data-access';
import { RedirectService } from '@shared/services';

export const authGuard: CanActivateFn = () => {
  const redirectService = inject(RedirectService);
  const authStore = inject(AuthStore);
  const isLoggedIn = !!authStore.data();
  if (isLoggedIn) {
    return true;
  }

  return redirectService.createLoginUrlTree();
};
