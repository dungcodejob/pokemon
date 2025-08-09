import { PokemonType } from '@app/entities';
import { ApiProperty } from '@nestjs/swagger';

export class PokemonTypeResultDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;

  private constructor(partial: Partial<PokemonTypeResultDto>) {
    Object.assign(this, partial);
  }
  static create(entity: PokemonType): PokemonTypeResultDto;
  static create(entity: PokemonType[]): PokemonTypeResultDto[];
  static create(
    entity: PokemonType | PokemonType[],
  ): PokemonTypeResultDto | PokemonTypeResultDto[] {
    if (Array.isArray(entity)) {
      return entity.map((item) => this.create(item));
    }
    return new PokemonTypeResultDto({
      id: entity.id,
      name: entity.name,
    });
  }
}
