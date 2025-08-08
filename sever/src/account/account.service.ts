import { Account } from '@app/entities';
import { AccountRepository } from '@app/repositories';
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

  findOneById(id: string) {
    return this._repository.findOne(
      {
        id,
      },
      { populate: ['user'] },
    );
  }

  findOneByUsername(username: string) {
    return this._repository.findOne(
      {
        username,
      },
      { populate: ['user'] },
    );
  }

  findOneByEmail(email: string) {
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
