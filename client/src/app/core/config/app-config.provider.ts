import {
  EnvironmentProviders,
  inject,
  InjectionToken,
  Provider,
  Signal,
} from '@angular/core';
import { provideAppConfigInitializer } from './app-config-initializer.provider';
import { AppConfigService, PKConfig } from './app-config.service';

const APP_CONFIG = new InjectionToken<Signal<PKConfig>>(
  'my-collection.app-config',
);

export const injectAppConfig = (): Signal<PKConfig> => inject(APP_CONFIG);

export function providerAppConfig(
  defaultConfig: PKConfig,
): (EnvironmentProviders | Provider)[] {
  return [
    provideAppConfigInitializer(defaultConfig),
    {
      provide: APP_CONFIG,
      useFactory: (): Signal<PKConfig> => {
        const configService = inject(AppConfigService);
        return configService.config;
      },
    },
  ];
}
