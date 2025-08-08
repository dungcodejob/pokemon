import {
  type AppConfig,
  InjectAppConfig,
  InjectJwtConfig,
  type JwtConfig,
} from '@app/configs';
import { COOKIE_KEY } from '@app/constants';
import { CurrentUser, Public, ResponseMessage } from '@app/decorators';
import { User } from '@app/entities';
import { ErrorResponseDto, Result, SuccessResponseDto } from '@app/models';
import { UserService } from '@app/user';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { type FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@ApiTags('auth')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  private readonly _cookiePath = '/api/auth';
  private readonly _isTesting: boolean;
  private readonly _refreshTime: number;

  constructor(
    @InjectJwtConfig() jwtConfig: JwtConfig,
    @InjectAppConfig() appConfig: AppConfig,
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
  ) {
    this._refreshTime = jwtConfig.refresh.time;
    this._isTesting = appConfig.testing;
  }

  @Public()
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

  @Public()
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

  @Get('/me')
  @ApiOkResponse({
    type: User,
    description: 'The user is found and returned.',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  public async getMe(@CurrentUser('id') id: string) {
    console.log(id);
    const user = await this._userService.findOneByAccountId(id);

    return Result.toSingle(user);
  }
}
