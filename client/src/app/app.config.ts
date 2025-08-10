import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  Injector,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authEvents, AuthStore } from '@auth/data-access';
import { provideAppInitWithConfigAsync, providerAppConfig } from '@core/config';
import { injectDispatch } from '@ngrx/signals/events';
import { ThemeService } from '@shared/services';
import { webShellRoutes } from '@shell/feature';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { filter, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { icons } from './icons-provider';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      webShellRoutes,
      withRouterConfig({ defaultQueryParamsHandling: 'preserve' }),
    ),
    AuthStore,
    provideNzIcons(icons),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    providerAppConfig(environment),
    provideAppInitWithConfigAsync(() => {
      const themeService = inject(ThemeService);
      const authStore = inject(AuthStore);
      const injector = inject(Injector);
      const authDispatcher = injectDispatch(authEvents);

      return () => {
        authDispatcher.initializer();
        themeService.initialize();
        return toObservable(authStore.isInitialized, { injector }).pipe(
          filter(Boolean),
          take(1),
        );
      };
    }),
  ],
};
