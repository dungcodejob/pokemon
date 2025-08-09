import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class PokemonImportOptionDto {
  @ApiProperty({
    description: 'Skip import pokemon type if it already exists',
  })
  @IsBoolean()
  @IsOptional()
  isSkipPokemonTypeDuplicates: boolean = true;

  @ApiProperty({
    description: 'Skip import pokemon if it already exists',
  })
  @IsBoolean()
  @IsOptional()
  isSkipPokemonDuplicates: boolean = true;

  @ApiProperty({
    description: 'Skip import error rows',
  })
  @IsBoolean()
  @IsOptional()
  isSkipErrorRows: boolean = false;
}
