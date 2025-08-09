import { Pokemon, PokemonType } from '@app/entities';
import { ImportModule } from '@app/import';
import { provideUnitOfWork } from '@app/repositories';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
@Module({
  imports: [MikroOrmModule.forFeature([PokemonType, Pokemon]), ImportModule],
  controllers: [PokemonController],
  providers: [PokemonService, provideUnitOfWork()],
  exports: [PokemonService],
})
export class PokemonModule {}
