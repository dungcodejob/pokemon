import { REQUEST_KEY } from '@app/constants';
import { Account } from '@app/entities';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type UserRecord = keyof Account;

export const CurrentAccount = createParamDecorator(
  (data: UserRecord, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return data
      ? request[REQUEST_KEY.CURRENT_ACCOUNT]?.[data]
      : request[REQUEST_KEY.CURRENT_ACCOUNT];
  },
);
