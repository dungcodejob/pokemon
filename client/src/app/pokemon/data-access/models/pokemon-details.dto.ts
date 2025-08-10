import { PokemonTypeResultDto } from './pokemon-type-result.dto';

export type PokemonDetailsDto = {
  id: string;
  name: string;
  types: PokemonTypeResultDto[];
  total: number;
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  generation: number;
  legendary: boolean;

  image: string;

  ytbUrl: string;
};
