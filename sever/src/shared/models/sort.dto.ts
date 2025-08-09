import { SortOrder } from '@app/constants';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export abstract class SortDto<T = string> {
  @ApiPropertyOptional({
    description: 'Target field',
  })
  @IsString()
  sortBy: T;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: Object.values(SortOrder),
    default: SortOrder.Asc,
  })
  @IsOptional()
  @IsString()
  order: SortOrder;
}
