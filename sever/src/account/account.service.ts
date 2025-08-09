import { Account } from '@app/entities';
import { Errors } from '@app/errors';
import { AccountRepository } from '@app/repositories';
import { isNil } from '@app/utils';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, FilterQuery } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

type AccountCreateInput = ConstructorParameters<typeof Account>[0];

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    protected readonly _repository: AccountRepository,
    protected readonly _em: EntityManager,
  ) {}

  async findOneByCredentials(id: string, version: number) {
    const account = await this._repository.findOne(
      {
        id,
        version,
      },
      { populate: ['user'] },
    );

    if (isNil(account)) {
      throw Errors.Authentication.InvalidCredentials;
    }

    if (account.version !== version) {
      throw Errors.Authentication.InvalidCredentials;
    }

    return account;
  }

  async findOneById(id: string) {
    return this._repository.findOne(
      {
        id,
      },
      { populate: ['user'] },
    );
  }

  async findOneByUsername(username: string) {
    return this._repository.findOne(
      {
        username,
      },
      { populate: ['user'] },
    );
  }

  async findOneByEmail(email: string) {
    return this._repository.findOne(
      {
        email,
      },
      { populate: ['user'] },
    );
  }

  count(where: FilterQuery<Account>): Promise<number> {
    return this._repository.count(where);
  }

  create(data: AccountCreateInput): Account {
    const account = new Account(data);
    return this._repository.create(account);
  }

  flush(): Promise<void> {
    return this._em.flush();
  }
}
