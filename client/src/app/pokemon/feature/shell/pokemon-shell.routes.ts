import { Routes } from '@angular/router';
import { PKPokemonStore } from '@pokemon/data-access';

export const PokemonShellRoutes: Routes = [
  {
    path: '',
    loadComponent: async () =>
      (await import('@pokemon/feature')).PKPokemonManagement,
    providers: [PKPokemonStore],
  },
];
