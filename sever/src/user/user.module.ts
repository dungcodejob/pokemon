import { User } from '@app/entities';
import { provideUnitOfWork } from '@app/repositories';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UserService, provideUnitOfWork()],
  exports: [UserService],
})
export class UserModule {}
