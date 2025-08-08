import {
  type AppConfig,
  InjectAppConfig,
  InjectJwtConfig,
  type JwtConfig,
} from '@app/configs';
import { COOKIE_KEY } from '@app/constants';
import { ResponseMessage } from '@app/decorators';
import { ErrorResponseDto, Result, SuccessResponseDto } from '@app/models';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { type FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { RegisterDto } from './dto/register.dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly _cookiePath = '/api/auth';
  private readonly _isTesting: boolean;
  private readonly _refreshTime: number;

  constructor(
    @InjectJwtConfig() jwtConfig: JwtConfig,
    @InjectAppConfig() appConfig: AppConfig,
    private readonly _authService: AuthService,
  ) {
    this._refreshTime = jwtConfig.refresh.time;
    this._isTesting = appConfig.testing;
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been registered successfully',
    type: SuccessResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body',
    type: ErrorResponseDto,
  })
  @ResponseMessage('The user has been registered successfully')
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this._authService.register(registerDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been logged in successfully',
    type: SuccessResponseDto,
  })
  @ResponseMessage('The user has been registered successfully')
  @Post('login')
  async login(@Res() res: FastifyReply, @Body() loginDto: LoginDto) {
    const result = await this._authService.login(loginDto);
    this.saveRefreshCookie(res, result.refreshToken);

    return Result.toSingle(result);
  }

  private saveRefreshCookie(
    res: FastifyReply,
    refreshToken: string,
  ): FastifyReply {
    return res.cookie(COOKIE_KEY.REFRESH_TOKEN, refreshToken, {
      secure: !this._isTesting,
      httpOnly: true,
      signed: true,
      path: this._cookiePath,
      expires: new Date(Date.now() + this._refreshTime * 1000),
    });
  }
}
