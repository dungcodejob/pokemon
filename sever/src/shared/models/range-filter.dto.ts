import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export abstract class RangeFilterDto<T = string> {
  @ApiPropertyOptional({ description: 'Minimum value' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  min?: number;

  @ApiPropertyOptional({ description: 'Maximum value' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  max?: number;

  @ApiPropertyOptional({ description: 'Exact value' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  exact?: number;

  @ApiPropertyOptional({
    description: 'Target field',
  })
  @IsString()
  filterBy: T;
}
