import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { PKPokemonCard } from '@pokemon/ui';
import { ROUTES } from '@shared/constants';
import { appEvents } from '@shared/data-access';
import { injectAutoEffect } from '@shared/utils';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { PKPokemonManagementFacade } from './pokemon-management.facade';
@Component({
  selector: 'app-pokemon-management',
  imports: [PKPokemonCard, NzGridModule],
  providers: [PKPokemonManagementFacade],
  templateUrl: './pokemon-management.html',
  styleUrl: './pokemon-management.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PKPokemonManagement implements OnInit {
  private readonly _autoEffect = injectAutoEffect();
  private readonly _pokemonManagementFacade = inject(PKPokemonManagementFacade);
  private readonly _appDispatch = injectDispatch(appEvents);

  $errorMessage = this._pokemonManagementFacade.$errorMessage;
  $isPending = this._pokemonManagementFacade.$isPending;
  $pokemonList = this._pokemonManagementFacade.$pokemonList;
  registerLink = ROUTES.REGISTER;

  ngOnInit(): void {
    this._pokemonManagementFacade.find({ filter: {} });
    this._autoEffect(() => {
      const isPending = this._pokemonManagementFacade.$isPending();
      this._appDispatch.setLoading({ loading: isPending });
    });
  }
}
