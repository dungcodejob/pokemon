import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  emailOrUsername: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
