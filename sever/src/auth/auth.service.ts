import { AccountService } from '@app/account';
import { SLUG_REGEX } from '@app/constants';
import { Role } from '@app/entities';
import { Errors } from '@app/errors';
import { UserService } from '@app/user';
import { formatName, generatePointSlug } from '@app/utils';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { isEmail } from 'class-validator';
import { AuthResultDto, LoginDto, RegisterDto } from './dto';
import { TokenTypeEnum } from './enums/token-type.enum';
import { BacklistService, BcryptService } from './services';
import { JwtTokenService } from './services/jwt-token.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly _accountService: AccountService,
    private readonly _userService: UserService,
    private readonly _bcryptService: BcryptService,
    private readonly _jwtTokenService: JwtTokenService,
    private readonly _backlistService: BacklistService,
    private readonly _em: EntityManager,
  ) {}

  async login(dto: LoginDto): Promise<AuthResultDto> {
    const { emailOrUsername, password } = dto;

    const account = await this.getAccountByEmailOrUsername(emailOrUsername);

    if (!account) {
      throw Errors.Authentication.InvalidCredentials;
    }

    const isMatchPassword = await compare(password, account.passwordHash);

    if (!isMatchPassword) {
      throw Errors.Authentication.InvalidCredentials;
    }

    const accessToken =
      await this._jwtTokenService.generateAccessToken(account);
    const refreshToken =
      await this._jwtTokenService.generateRefreshToken(account);

    return {
      accessToken,
      refreshToken,
      user: account.user,
    };
  }

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;
    const isEmailExists = await this.checkEmailExists(email);

    if (isEmailExists) {
      throw Errors.Authentication.EmailAlreadyExists;
    }

    const formattedName = formatName(name);
    const passwordHash = await this._bcryptService.hash(password);
    const username = await this.generateUsername(formattedName);

    const user = this._userService.create({
      name,
      role: Role.USER,
    });

    this._accountService.create({
      email,
      passwordHash,
      username,
      user,
    });

    await this._em.flush();
  }

  async refreshToken(
    refreshToken: string,
    domain?: string,
  ): Promise<AuthResultDto> {
    const { id, version, tokenId } = await this._jwtTokenService.verifyToken(
      refreshToken,
      TokenTypeEnum.REFRESH,
    );

    const isBlacklisted = await this._backlistService.checkIfTokenIsBlacklisted(
      id,
      tokenId,
    );

    if (isBlacklisted) {
      throw Errors.Authentication.InvalidToken;
    }

    const account = await this._accountService.findOneByCredentials(
      id,
      version,
    );

    const accessToken = await this._jwtTokenService.generateAccessToken(
      account,
      domain,
    );

    const newRefreshToken = await this._jwtTokenService.generateRefreshToken(
      account,
      domain,
      tokenId,
    );

    return { user: account.user, accessToken, refreshToken: newRefreshToken };
  }

  async logout(accessToken: string) {
    const { id, tokenId, exp } = await this._jwtTokenService.verifyToken(
      accessToken,
      TokenTypeEnum.REFRESH,
    );

    await this._backlistService.addTokenBlacklist(id, tokenId, exp);
  }

  private async getAccountByEmailOrUsername(emailOrUsername: string) {
    if (emailOrUsername.includes('@')) {
      if (!isEmail(emailOrUsername)) {
        throw Errors.Authentication.InvalidEmailOrUsername;
      }
      return this._accountService.findOneByEmail(emailOrUsername);
    }

    if (
      emailOrUsername.length < 3 ||
      emailOrUsername.length > 106 ||
      !SLUG_REGEX.test(emailOrUsername)
    ) {
      throw Errors.Authentication.InvalidEmailOrUsername;
    }

    return this._accountService.findOneByUsername(emailOrUsername);
  }

  private async checkEmailExists(email: string) {
    const count = await this._accountService.count({
      email,
    });

    return count > 0;
  }

  private async generateUsername(name: string): Promise<string> {
    const pointSlug = generatePointSlug(name);
    const count = await this._accountService.count({
      username: {
        $like: `${pointSlug}%`,
      },
    });

    if (count > 0) {
      return `${pointSlug}${count}`;
    }

    return pointSlug;
  }
}
