import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PKLocalConfig } from './local-config';
import { PKRemoteConfig } from './remote-config';

export type PKConfig = PKLocalConfig & PKRemoteConfig;

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly _http = inject(HttpClient);
  private readonly _configUrl = 'configuration/config.json';
  private readonly _config = signal<PKConfig | null>(null);

  readonly config = computed(() => {
    const value = this._config();
    if (!value) {
      throw new Error('Config not initialized');
    }
    return value;
  });

  setConfig(config: PKConfig): void {
    this._config.set(config);
  }

  load(defaultConfig: PKConfig): Observable<PKConfig> {
    return this._http.get<PKConfig | null>(this._configUrl).pipe(
      map((config) => {
        const mergedConfig = config
          ? { ...defaultConfig, ...config }
          : defaultConfig;
        this.setConfig(mergedConfig);

        return mergedConfig;
      }),
    );
  }
}
