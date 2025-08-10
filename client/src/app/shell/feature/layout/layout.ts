import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ROUTES } from '@shared/constants';
import { ThemeService } from '@shared/services';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-layout',
  imports: [
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PKLayout {
  private readonly _themeService = inject(ThemeService);
  isCollapsed = false;
  dashboardLink = ROUTES.HOME;
  pokemonLink = ROUTES.POKEMON;
  favoritesLink = ROUTES.FAVORITES;

  $isDarkTheme = this._themeService.isDarkMode;

  onToggleTheme() {
    this._themeService.toggleMode();
  }
}
