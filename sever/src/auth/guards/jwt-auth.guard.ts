import { METADATA_KEY } from '@app/constants';
import { isNil } from '@app/utils';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isJWT } from 'class-validator';
import { FastifyRequest } from 'fastify';
import { TokenTypeEnum } from '../enums/token-type.enum';
import { JwtTokenService } from '../services';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(METADATA_KEY.IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const token = this.getTokenFromRequest(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    const { id } = await this.jwtTokenService.verifyToken(
      token,
      TokenTypeEnum.ACCESS,
    );
    request.user = { id };

    return true;
  }

  private getTokenFromRequest(req: FastifyRequest): string | false {
    const auth = req.headers?.authorization;
    if (isNil(auth) || auth.length === 0) {
      return false;
    }

    const authArr = auth.split(' ');
    const bearer = authArr[0];
    const token = authArr[1];

    if (isNil(bearer) || bearer !== 'Bearer') {
      return false;
    }
    if (isNil(false) || !isJWT(token)) {
      return false;
    }

    return token;
  }
}
