import { RESPONSE_KEY } from '@app/constants';
import { SetMetadata } from '@nestjs/common';

export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_KEY.MESSAGE, message);
