import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class PokemonCsvRowDto {
  id: number;

  @IsString({ message: 'Pokemon name must be a string' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString({ message: 'Pokemon type must be a string' })
  @Transform(({ value }) => value?.trim())
  type1: string;

  @IsString({ message: 'Pokemon type must be a string' })
  @Transform(({ value }) => value?.trim())
  type2: string;

  @IsNumber({}, { message: 'Total must be a number' })
  @Min(1, { message: 'Total must be greater than 0' })
  @Transform(({ value }) => parseInt(value, 10))
  total: number;

  @IsNumber({}, { message: 'HP must be a number' })
  @Min(1, { message: 'HP must be greater than 0' })
  @Transform(({ value }) => parseInt(value, 10))
  hp: number;

  @IsNumber({}, { message: 'Attack must be a number' })
  @Min(1, { message: 'Attack must be greater than 0' })
  @Transform(({ value }) => parseInt(value, 10))
  attack: number;

  @IsNumber({}, { message: 'Defense must be a number' })
  @Min(1, { message: 'Defense must be greater than 0' })
  @Transform(({ value }) => parseInt(value, 10))
  defense: number;

  @IsNumber({}, { message: 'Special Attack must be a number' })
  @Min(1, { message: 'Special Attack must be greater than 0' })
  @Transform(({ value }) => parseInt(value, 10))
  specialAttack: number;

  @IsNumber({}, { message: 'Special Defense must be a number' })
  @Min(1, { message: 'Special Defense must be greater than 0' })
  @Transform(({ value }) => parseInt(value, 10))
  specialDefense: number;

  @IsNumber({}, { message: 'Generation must be a number' })
  @Min(1, { message: 'Generation must be 1 or greater' })
  @Transform(({ value }) => parseInt(value, 10))
  speed: number;

  @IsBoolean({ message: 'Legendary must be a boolean' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1';
    }
    return Boolean(value);
  })
  legendary: boolean;

  @IsNumber({}, { message: 'Generation must be a number' })
  @Min(1, { message: 'Generation must be 1 or greater' })
  @Transform(({ value }) => parseInt(value, 10))
  generation: number;

  @IsOptional()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  @Transform(({ value }) => value?.trim() || null)
  image?: string;

  @IsOptional()
  @IsUrl({}, { message: 'YouTube URL must be a valid URL' })
  @Transform(({ value }) => value?.trim() || null)
  ytbUrl?: string;
}
