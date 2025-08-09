import { Inject, Injectable, Provider } from '@nestjs/common';

import { Account, Pokemon, PokemonType, User } from '@app/entities';
import { EntityManager } from '@mikro-orm/postgresql';
import { AccountRepository } from './account.repository';
import { PokemonTypeRepository } from './pokemon-type.repository';
import { PokemonRepository } from './pokemon.repository';
import { UserRepository } from './user.repository';

export const UNIT_OF_WORK = Symbol('UnitOfWork');

export interface UnitOfWork {
  user: UserRepository;
  account: AccountRepository;
  pokemonType: PokemonTypeRepository;
  pokemon: PokemonRepository;
  save(): Promise<void>;
}

@Injectable()
export class UnitOfWorkImpl implements UnitOfWork {
  @Inject()
  private readonly _em: EntityManager;
  private _user?: UserRepository;
  private _account?: AccountRepository;
  private _pokemonType?: PokemonTypeRepository;
  private _pokemon?: PokemonRepository;

  constructor() {}

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

  save(): Promise<void> {
    return this._em.flush();
  }
}

export const provideUnitOfWork = (): Provider => ({
  provide: UNIT_OF_WORK,
  useClass: UnitOfWorkImpl,
});
