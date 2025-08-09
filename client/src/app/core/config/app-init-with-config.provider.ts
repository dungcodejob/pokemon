import { InjectionToken, Provider, Type } from '@angular/core';
import { PKLocalConfig } from './local-config';

export type OnInitConfig = {
  configure(config: PKLocalConfig): void;
};

export const APP_INIT_WITH_CONFIG = new InjectionToken<readonly OnInitConfig[]>(
  'APP_INI_WITH_CONFIG',
);

type ProviderFn = <T extends OnInitConfig>(impl: Type<T>) => Provider;
export const provideAppInitWithConfig: ProviderFn = <T extends OnInitConfig>(
  impl: Type<T>,
): Provider => ({
  provide: APP_INIT_WITH_CONFIG,
  multi: true,
  useExisting: impl,
});
