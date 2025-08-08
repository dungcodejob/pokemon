import { REQUEST_KEY } from '@app/constants';
import { User } from '@app/entities';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type UserRecord = keyof User;

export const CurrentUser = createParamDecorator(
  (data: UserRecord, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return data
      ? request[REQUEST_KEY.CURRENT_USER]?.[data]
      : request[REQUEST_KEY.CURRENT_USER];
  },
);
