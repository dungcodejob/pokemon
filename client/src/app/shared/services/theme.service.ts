import {
  computed,
  DestroyRef,
  DOCUMENT,
  inject,
  Injectable,
  InjectionToken,
  Renderer2,
  RendererFactory2,
  signal,
  Signal,
} from '@angular/core';
import { injectAutoEffect } from '@shared/utils';
import { StorageService } from './storage.service';

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
  Default = ThemeMode.System,
}

export const PREFERRED_THEME_MODE_TOKEN = new InjectionToken<
  Signal<ThemeMode.Dark | ThemeMode.Light>
>('PREFERRED_THEME_MODE', {
  providedIn: 'root',
  factory: (): Signal<ThemeMode.Dark | ThemeMode.Light> => {
    const window = inject(DOCUMENT)?.defaultView;
    if (window === null || !window.matchMedia) {
      throw new Error('window.matchMedia is not supported');
    }

    const destroyRef = inject(DestroyRef);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const colorMode = signal<ThemeMode.Dark | ThemeMode.Light>(
      mediaQuery.matches ? ThemeMode.Dark : ThemeMode.Light,
    );

    const preferredColorModeChangeListener = (
      event: MediaQueryListEvent,
    ): void => {
      if (event.matches) {
        colorMode.set(ThemeMode.Dark);
      } else {
        colorMode.set(ThemeMode.Light);
      }
    };

    mediaQuery.addEventListener('change', preferredColorModeChangeListener);

    destroyRef.onDestroy(() =>
      mediaQuery.removeEventListener(
        'change',
        preferredColorModeChangeListener,
      ),
    );

    return colorMode;
  },
});

export const THEME_MODE_KEY = 'theme-mode';
export const THEME_DARK_MODE_CLASS = 'dark';

export const injectRenderer2 = (): Renderer2 =>
  inject(RendererFactory2).createRenderer(null, null);

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly _autoEffect = injectAutoEffect();
  private readonly _storageService = inject(StorageService);
  private readonly _storedMode = this._storageService.form<ThemeMode>(
    THEME_MODE_KEY,
    ThemeMode.Default,
  );
  private readonly _preferredMode = inject(PREFERRED_THEME_MODE_TOKEN);

  readonly mode = computed(() => {
    const preferred = this._preferredMode();
    const stored = this._storedMode();

    if (stored === ThemeMode.System) {
      return preferred;
    }

    return stored ?? preferred;
  });

  readonly isDarkMode = computed(() => this.mode() === ThemeMode.Dark);

  setMode(mode: ThemeMode): void {
    this._storedMode.set(mode);
  }

  toggleMode(): void {
    const current = this._storedMode();
    const next = current === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light;
    this.setMode(next);
  }

  initialize(): void {
    this._autoEffect(() => {
      const isDarkMode = this.isDarkMode();
      if (isDarkMode) {
        this.loadTheme(ThemeMode.Dark, false);
      } else {
        this.loadTheme(ThemeMode.Light, false);
      }
    });
  }

  private reverseTheme(theme: ThemeMode): ThemeMode {
    return theme === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark;
  }

  private loadCss(href: string, id: string): Promise<Event> {
    return new Promise((resolve, reject) => {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = href;
      style.id = id;
      style.onload = resolve;
      style.onerror = reject;
      document.head.append(style);
    });
  }

  private loadTheme(theme: ThemeMode, firstLoad = true): Promise<Event> {
    if (firstLoad) {
      document.documentElement.classList.add(theme);
    }
    return new Promise<Event>((resolve, reject) => {
      console.log('loadTheme', theme);
      this.loadCss(`${theme}.css`, theme).then(
        (e) => {
          if (!firstLoad) {
            document.documentElement.classList.add(theme);
          }
          this.removeUnusedTheme(this.reverseTheme(theme));
          resolve(e);
        },
        (e) => reject(e),
      );
    });
  }

  private removeUnusedTheme(theme: ThemeMode): void {
    document.documentElement.classList.remove(theme);
    const removedThemeStyle = document.getElementById(theme);
    if (removedThemeStyle) {
      document.head.removeChild(removedThemeStyle);
    }
  }
}
