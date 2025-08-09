import { Pokemon, PokemonFavorite, PokemonType } from '@app/entities';
import { ImportModule } from '@app/import';
import { provideUnitOfWork } from '@app/repositories';
import { UserModule } from '@app/user';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
@Module({
  imports: [
    MikroOrmModule.forFeature([PokemonType, Pokemon, PokemonFavorite]),
    ImportModule,
    UserModule,
  ],
  controllers: [PokemonController],
  providers: [PokemonService, provideUnitOfWork()],
  exports: [PokemonService],
})
export class PokemonModule {}
