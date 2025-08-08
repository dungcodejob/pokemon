import { User } from '@app/entities';
import { UserRepository } from '@app/repositories';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

type UserCreateInput = ConstructorParameters<typeof User>[0];

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _repository: UserRepository,
    private readonly _em: EntityManager,
  ) {}

  create(data: UserCreateInput): User {
    const user = new User(data);
    return this._repository.create(user);
  }

  flush(): Promise<void> {
    return this._em.flush();
  }
}
