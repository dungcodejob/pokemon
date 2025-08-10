import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { ROUTES } from '@shared/constants';

export const REDIRECT_PARAM = 'redirectTo';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  private readonly _router = inject(Router);

  clearSavedUrl(): void {
    const urlTree = this._router.parseUrl(this._router.url);
    if (urlTree.queryParams[REDIRECT_PARAM]) {
      delete urlTree.queryParams[REDIRECT_PARAM];
      this._router.navigateByUrl(urlTree, { replaceUrl: true });
    }
  }

  createLoginUrlTree(redirectUrl?: string): UrlTree {
    const urlToRedirect = redirectUrl || this._router.url;

    if (this.isAllowAddRedirectParam(urlToRedirect)) {
      return this._router.createUrlTree([ROUTES.LOGIN]);
    }

    return this._router.createUrlTree([ROUTES.LOGIN], {
      queryParams: {
        [REDIRECT_PARAM]: encodeURIComponent(urlToRedirect),
      },
    });
  }

  redirectToLogin(): void {
    this._router.navigateByUrl(this.createLoginUrlTree());
  }

  redirectToSavedUrl(defaultUrl = '/'): void {
    const savedUrl = this.getRedirectUrlFromQueryParam() ?? defaultUrl;
    if (this.isAllowAddRedirectParam(savedUrl)) {
      this.clearSavedUrl();
      this._router.navigateByUrl(savedUrl);
    } else {
      this._router.navigateByUrl(defaultUrl);
    }
  }

  private isAllowAddRedirectParam(url: string | null): boolean {
    return !!url && url !== ROUTES.LOGIN && !url.includes(ROUTES.LOGIN);
  }

  private getRedirectUrlFromQueryParam(): string | null {
    const urlTree = this._router.parseUrl(this._router.url);
    const redirectTo = urlTree.queryParams[REDIRECT_PARAM];

    if (redirectTo && typeof redirectTo === 'string') {
      try {
        return decodeURIComponent(redirectTo);
      } catch {
        return redirectTo;
      }
    }

    return null;
  }
}
