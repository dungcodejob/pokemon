import { UserRepository } from '@app/repositories';
import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v6 } from 'uuid';
import { Account } from './account.entity';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity({ repository: () => UserRepository })
export class User {
  @PrimaryKey()
  id: string = v6();

  @Property()
  name: string;

  @Enum(() => Role)
  role: Role = Role.USER;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @OneToMany(() => Account, (account) => account.user)
  accounts = new Collection<Account>(this);

  @Property()
  deleteFlag: boolean = false;

  @Property({ nullable: true })
  deletedAt?: Date;

  constructor({ name, role }) {
    this.name = name;
    this.role = role;
  }
}
