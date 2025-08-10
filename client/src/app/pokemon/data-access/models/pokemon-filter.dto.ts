import { PaginationDto } from '@core/http';
import { RangeFilterDto } from './range-filter.dto';
import { SortDto } from './sort.dto';

export enum PokemonRangeFilterField {
  Total = 'total',
  Hp = 'hp',
  Attack = 'attack',
  Defense = 'defense',
  SpecialAttack = 'spAttack',
  SpecialDefense = 'spDefense',
  Speed = 'speed',
}

export enum PokemonSortField {
  Name = 'name',
  Total = 'total',
  Hp = 'hp',
  Attack = 'attack',
  Defense = 'defense',
  SpecialAttack = 'spAttack',
  SpecialDefense = 'spDefense',
  Speed = 'speed',
}

export class PokemonFilterDto {
  name?: string;
  legendary?: boolean;
  typeIds?: string[];
  ranges?: RangeFilterDto<PokemonRangeFilterField>[];
  sort?: SortDto<PokemonSortField>;
  pagination?: PaginationDto;
}
