import { computed, inject } from '@angular/core';
import { errorToString } from '@core/http';
import {
  signalStore,
  withComputed,
  withMethods,
  withProps,
} from '@ngrx/signals';
import { injectDispatch } from '@ngrx/signals/events';
import { PKPokemonStore, pokemonEvents } from '@pokemon/data-access';

export const PKPokemonManagementFacade = signalStore(
  withProps(() => ({
    _pokemonStore: inject(PKPokemonStore),
    _pokemonDispatch: injectDispatch(pokemonEvents),
  })),
  withComputed(({ _pokemonStore }) => ({
    $pokemonList: computed(() => _pokemonStore.entities()),
    $isPending: computed(() => _pokemonStore.$isFindPending()),
    $errorMessage: computed(() => errorToString(_pokemonStore.$findError())),
  })),
  withMethods(({ _pokemonStore, _pokemonDispatch: _dispatch }) => ({
    find: _dispatch.find,
  })),
);
