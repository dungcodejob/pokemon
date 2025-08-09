import { AccountRepository } from '@app/repositories';
import {
  Cascade,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v6 } from 'uuid';
import { User } from './user.entity';

@Entity({ repository: () => AccountRepository })
export class Account {
  @PrimaryKey()
  id: string = v6();

  @Property({ unique: true })
  username: string;

  @Property({ unique: true })
  email: string;

  @Property({ nullable: true })
  refreshToken?: string;

  @Property()
  passwordHash: string;

  @Property()
  version: number = 0;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  passwordUpdatedAt: Date = new Date();

  @Property()
  isActive: boolean = true;

  @Property({ nullable: true })
  lastLoginAt?: Date;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt?: Date = new Date();

  @ManyToOne(() => User, { cascade: [Cascade.REMOVE] })
  user: User;

  @Property({ default: false })
  deleteFlag?: boolean = false;

  @Property({ nullable: true })
  deletedAt?: Date;

  [EntityRepositoryType]?: AccountRepository;

  constructor({
    username,
    email,
    passwordHash,
    user,
  }: {
    username: string;
    email: string;
    passwordHash: string;
    user: User;
  }) {
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.user = user;
  }
}
