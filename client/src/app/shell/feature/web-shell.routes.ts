import { Routes } from '@angular/router';
import { authGuard } from '@auth/utils';
import { PKLayout } from './layout/layout';

export const webShellRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    canActivate: [authGuard],
    component: PKLayout,
    children: [
      {
        path: 'pokemon',
        loadChildren: () =>
          import('@pokemon/feature').then((mod) => mod.PokemonShellRoutes),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@auth/feature').then((mod) => mod.AuthShellRoutes),
  },
];
