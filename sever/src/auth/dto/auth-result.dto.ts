import { User } from '@app/entities';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResultDto {
  @ApiProperty()
  user: User;
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}
