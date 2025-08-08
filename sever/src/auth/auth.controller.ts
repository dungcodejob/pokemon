import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { ResponseMessage } from '@app/decorators';
import { SuccessResponseDto } from '@app/models';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Register successfully')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Register successfully',
    type: SuccessResponseDto,
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('body', registerDto);
    try {
      return this._authService.register(registerDto);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
