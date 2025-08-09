import {
  type AppConfig,
  InjectAppConfig,
  InjectJwtConfig,
  type JwtConfig,
} from '@app/configs';
import { COOKIE_KEY } from '@app/constants';
import { CurrentUser, Origin, Public, ResponseMessage } from '@app/decorators';
import { User } from '@app/entities';
import { Errors } from '@app/errors';
import { ErrorResponseDto, Result, SuccessResponseDto } from '@app/models';
import { UserService } from '@app/user';
import { isNil } from '@app/utils';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { AuthResultDto, LoginDto, RefreshAccessDto } from './dto';
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
    type: SuccessResponseDto<AuthResultDto>,
  })
  @ResponseMessage('The user has been registered successfully')
  @Post('login')
  async login(@Res() res: FastifyReply, @Body() loginDto: LoginDto) {
    const result = await this._authService.login(loginDto);
    this.saveRefreshCookie(res, result.refreshToken);

    return Result.toSingle(result);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The access token has been refreshed successfully',
    type: SuccessResponseDto<AuthResultDto>,
  })
  @ResponseMessage('The access token has been refreshed successfully')
  @Post('refresh')
  async refreshToken(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Body() refreshAccessDto: RefreshAccessDto,
    @Origin() origin: string,
  ) {
    const token = this.getRefreshFromCookieOrBody(req, refreshAccessDto);
    const result = await this._authService.refreshToken(token, origin);
    this.saveRefreshCookie(res, result.refreshToken);
    return Result.toSingle(result);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Body() refreshAccessDto?: RefreshAccessDto,
  ) {
    const token = this.getRefreshFromCookieOrBody(req, refreshAccessDto);
    await this._authService.logout(token);

    this.clearCookies(res)
      .header('Content-Type', 'application/json')
      .status(HttpStatus.OK);
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
    const user = await this._userService.findOneByAccountId(id);

    return Result.toSingle(user);
  }

  private getRefreshFromCookieOrBody(
    req: FastifyRequest,
    body?: RefreshAccessDto,
  ): string {
    const token: string | undefined =
      req.cookies[COOKIE_KEY.REFRESH_TOKEN] ?? body?.refreshToken;
    if (isNil(token)) {
      throw Errors.Authentication.InvalidRefreshToken;
    }

    const { valid, value } = req.unsignCookie(token);
    if (!valid) {
      throw Errors.Authentication.InvalidRefreshToken;
    }

    return value;
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

  private clearCookies(res: FastifyReply): FastifyReply {
    return res.clearCookie(COOKIE_KEY.REFRESH_TOKEN, {
      path: this._cookiePath,
    });
  }
}
