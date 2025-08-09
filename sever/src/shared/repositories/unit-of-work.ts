import { Inject, Injectable, Provider } from '@nestjs/common';

import {
  Account,
  FileImport,
  Pokemon,
  PokemonFavorite,
  PokemonType,
  User,
} from '@app/entities';
import { EntityManager } from '@mikro-orm/postgresql';
import { AccountRepository } from './account.repository';
import { FileImportRepository } from './file-import.repository';
import { PokemonFavoriteRepository } from './pokemon-favorite.repository';
import { PokemonTypeRepository } from './pokemon-type.repository';
import { PokemonRepository } from './pokemon.repository';
import { UserRepository } from './user.repository';

export const UNIT_OF_WORK = Symbol('UnitOfWork');

export interface UnitOfWork {
  user: UserRepository;
  account: AccountRepository;
  pokemonType: PokemonTypeRepository;
  pokemon: PokemonRepository;
  fileImport: FileImportRepository;
  pokemonFavorite: PokemonFavoriteRepository;
  save(): Promise<void>;
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getEntityManager(): EntityManager;
}

@Injectable()
export class UnitOfWorkImpl implements UnitOfWork {
  @Inject()
  private readonly _em: EntityManager;
  private _user?: UserRepository;
  private _account?: AccountRepository;
  private _fileImport?: FileImportRepository;
  private _pokemonType?: PokemonTypeRepository;
  private _pokemon?: PokemonRepository;
  private _pokemonFavorite?: PokemonFavoriteRepository;

  constructor() {}
  getEntityManager(): EntityManager {
    return this._em;
  }

  get user(): UserRepository {
    if (!this._user) {
      this._user = this._em.getRepository(User);
    }

    return this._user;
  }

  get account(): AccountRepository {
    if (!this._account) {
      this._account = this._em.getRepository(Account);
    }

    return this._account;
  }

  get pokemonType(): PokemonTypeRepository {
    if (!this._pokemonType) {
      this._pokemonType = this._em.getRepository(PokemonType);
    }

    return this._pokemonType;
  }

  get pokemon(): PokemonRepository {
    if (!this._pokemon) {
      this._pokemon = this._em.getRepository(Pokemon);
    }

    return this._pokemon;
  }

  get fileImport(): FileImportRepository {
    if (!this._fileImport) {
      this._fileImport = this._em.getRepository(FileImport);
    }

    return this._fileImport;
  }

  get pokemonFavorite(): PokemonFavoriteRepository {
    if (!this._pokemonFavorite) {
      this._pokemonFavorite = this._em.getRepository(PokemonFavorite);
    }

    return this._pokemonFavorite;
  }

  save(): Promise<void> {
    return this._em.flush();
  }

  async start() {
    await this._em.begin();
  }

  async commit() {
    await this._em.flush();
    await this._em.commit();
  }

  async rollback() {
    await this._em.rollback();
  }
}

export const provideUnitOfWork = (): Provider => ({
  provide: UNIT_OF_WORK,
  useClass: UnitOfWorkImpl,
});
