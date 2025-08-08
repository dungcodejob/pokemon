import { User } from '@app/entities';
import { EntityRepository } from '@mikro-orm/core';

export class UserRepository extends EntityRepository<User> {}
