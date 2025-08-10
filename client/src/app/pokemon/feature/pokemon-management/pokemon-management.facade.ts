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
    $name: computed(() => _pokemonStore.name()),
    $legendary: computed(() => _pokemonStore.legendary()),
    $typeIds: computed(() => _pokemonStore.typeIds()),
    $sortBy: computed(() => _pokemonStore.sortBy()),
    $sortOrder: computed(() => _pokemonStore.sortOrder()),
    $pokemonList: computed(() => _pokemonStore.entities()),
    $isPending: computed(() => _pokemonStore.$isFindPending()),
    $errorMessage: computed(() => errorToString(_pokemonStore.$findError())),
    $totalPages: computed(() => _pokemonStore.totalPages()),
    $totalCount: computed(() => _pokemonStore.totalCount()),
    $pageSize: computed(() => _pokemonStore.pageSize()),
    $currentPage: computed(() => _pokemonStore.currentPage()),
    $isImportPending: computed(() => _pokemonStore.$isImportPending()),
    $isImportFulfilled: computed(() => _pokemonStore.$isImportFulfilled()),
    $importErrorMessage: computed(() =>
      errorToString(_pokemonStore.$importError()),
    ),
  })),
  withMethods(({ _pokemonStore, _pokemonDispatch: _dispatch }) => ({
    find: _dispatch.find,
    setFilter: _dispatch.setFilter,
    setPagination: _dispatch.setPagination,
    setName: _dispatch.setName,
    setLegendary: _dispatch.setLegendary,
    import: _dispatch.import,
  })),
);
