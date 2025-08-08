import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';

@Entity()
export class Account {
  @PrimaryKey()
  id: string = v4();

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

  @Property()
  deleteFlag: boolean = false;

  @Property({ nullable: true })
  deletedAt?: Date;

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
