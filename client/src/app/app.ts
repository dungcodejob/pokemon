import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from '@auth/data-access';
import { injectDispatch } from '@ngrx/signals/events';
import { appEvents, AppStore } from '@shared/data-access';
import { injectAutoEffect } from '@shared/utils';
import { LoadingOverlay } from '@shell/ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet, LoadingOverlay],
})
export class App {
  private readonly _autoEffect = injectAutoEffect();
  private readonly _authStore = inject(AuthStore);
  private readonly _appStore = inject(AppStore);
  private readonly _appDispatcher = injectDispatch(appEvents);

  $isLoading = this._appStore.isLoading;

  ngOnInit(): void {
    this._autoEffect(() => {
      const isInitialized = this._authStore.isInitialized();
      if (isInitialized) {
        this._appDispatcher.setLoading({ loading: false });
      }
    });
  }

  isCollapsed = false;
}
