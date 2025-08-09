import { PaginationDto, RangeFilterDto, SortDto } from '@app/models';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

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
  @ApiPropertyOptional({ description: 'Search keyword' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter legendary Pokemon' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  legendary?: boolean;

  @ApiPropertyOptional({ description: 'Filter by types' })
  @IsOptional()
  @IsArray()
  typeIds?: string[];

  @ApiPropertyOptional({
    type: [RangeFilterDto<PokemonRangeFilterField>],
    description: 'Range filters',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RangeFilterDto<PokemonRangeFilterField>)
  ranges?: RangeFilterDto<PokemonRangeFilterField>[];

  @ApiPropertyOptional({
    type: SortDto<PokemonSortField>,
    description: 'Sort filters',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SortDto<PokemonSortField>)
  sort?: SortDto<PokemonSortField>;

  @ApiPropertyOptional({
    type: PaginationDto,
    description: 'Pagination filters',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PaginationDto)
  pagination?: PaginationDto;
}
