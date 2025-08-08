import { AccountService } from '@app/account';
import { Role } from '@app/entities';
import { UserService } from '@app/user';
import { formatName, generatePointSlug } from '@app/utils';
import { EntityManager } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto';
import { BcryptService } from './services';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly em: EntityManager,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;
    const isEmailExists = await this.checkEmailExists(email);

    if (isEmailExists) {
      throw new BadRequestException('Email already exists');
    }

    const formattedName = formatName(name);
    const passwordHash = await this.bcryptService.hash(password);
    const username = await this.generateUsername(formattedName);

    const user = this.userService.create({
      name,
      role: Role.USER,
    });

    this.accountService.create({
      email,
      passwordHash,
      username,
      user,
    });

    await this.em.flush();
  }

  private async checkEmailExists(email: string) {
    const count = await this.accountService.count({
      email,
    });

    return count > 0;
  }

  private async generateUsername(name: string): Promise<string> {
    const pointSlug = generatePointSlug(name);
    const count = await this.accountService.count({
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
