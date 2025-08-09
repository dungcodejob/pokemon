import { Account } from '@app/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Module({
  imports: [MikroOrmModule.forFeature([Account])],
  providers: [PokemonService],
  exports: [PokemonService],
})
export class PokemonModule {}
