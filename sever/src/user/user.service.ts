import { User } from '@app/entities';
import { UNIT_OF_WORK, type UnitOfWork } from '@app/repositories';
import { Inject, Injectable } from '@nestjs/common';

type UserCreateInput = ConstructorParameters<typeof User>[0];

@Injectable()
export class UserService {
  constructor(@Inject(UNIT_OF_WORK) private readonly _unitOfWork: UnitOfWork) {}

  async findOneByAccountId(accountId: string) {
    return this._unitOfWork.user.findOne({
      accounts: {
        id: accountId,
      },
    });
  }

  create(data: UserCreateInput): User {
    const user = new User(data);
    return this._unitOfWork.user.create(user);
  }

  flush(): Promise<void> {
    return this._unitOfWork.save();
  }
}
