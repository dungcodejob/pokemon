import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { TokenTypeEnum } from '../enums/token-type.enum';

import {
  type AppConfig,
  InjectAppConfig,
  InjectJwtConfig,
  type JwtConfig,
} from '@app/configs';
import { Account } from '@app/entities';
import { v6 } from 'uuid';
import { AccessPayload, AccessToken } from '../models/access-token';
import { RefreshPayload, RefreshToken } from '../models/refresh-token';

@Injectable()
export class JwtTokenService {
  private readonly issuer: string;

  constructor(
    @InjectJwtConfig() private readonly jwtConfig: JwtConfig,
    @InjectAppConfig() private readonly appConfig: AppConfig,
    private readonly jwtService: JwtService,
  ) {
    this.issuer = appConfig.appId;
  }

  generateAccessToken(
    account: Account,
    domain?: string | null,
  ): Promise<string> {
    const { secret, time } = this.jwtConfig[TokenTypeEnum.ACCESS];

    const jwtOptions: JwtSignOptions = {
      issuer: this.issuer,
      subject: account.email,
      audience: domain ?? this.appConfig.domain,
      algorithm: 'HS256',
      expiresIn: time,
    };

    const payload: AccessPayload = {
      id: account.id,
      email: account.email,
    };

    return this.generateToken(payload, secret, jwtOptions);
  }

  generateRefreshToken(
    account: Account,
    domain?: string | null,
    tokenId?: string,
  ): Promise<string> {
    const { secret, time } = this.jwtConfig[TokenTypeEnum.REFRESH];

    const jwtOptions: JwtSignOptions = {
      issuer: this.issuer,
      subject: account.email,
      audience: domain ?? this.appConfig.domain,
      algorithm: 'HS256', // only needs a secret
      expiresIn: time,
    };

    const payload: RefreshPayload = {
      id: account.id,
      email: account.email,
      tokenId: tokenId ?? v6(),
      version: account.version,
    };

    return this.generateToken(payload, secret, jwtOptions);
  }

  verifyToken(
    token: string,
    tokenType: TokenTypeEnum.ACCESS,
  ): Promise<AccessToken>;
  verifyToken(
    token: string,
    tokenType: TokenTypeEnum.REFRESH,
  ): Promise<RefreshToken>;
  verifyToken<T extends AccessToken | RefreshToken>(
    token: string,
    tokenType: TokenTypeEnum,
  ): Promise<T> {
    const { time, secret } = this.jwtConfig[tokenType];
    const jwtOptions: JwtVerifyOptions = {
      issuer: this.issuer,
      audience: new RegExp(this.appConfig.domain),
      secret,
      maxAge: time,
    };

    return this.jwtService.verifyAsync<T>(token, jwtOptions);
  }

  private generateToken(
    payload: AccessPayload,
    secret: string,
    options: JwtSignOptions,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret,
      ...options,
    });
  }
}
