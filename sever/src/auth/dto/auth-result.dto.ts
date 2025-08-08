import { User } from '@app/entities';

export interface AuthResultDto {
  user: User;
  accessToken: string;
  refreshToken: string;
}
