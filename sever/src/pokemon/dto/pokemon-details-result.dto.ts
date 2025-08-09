import { Pokemon } from '@app/entities';
import { ApiProperty } from '@nestjs/swagger';
import { PokemonTypeResultDto } from './pokemon-type-result.dto';

export class PokemonDetailsResultDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  types: PokemonTypeResultDto[];
  @ApiProperty()
  total: number;
  @ApiProperty()
  hp: number;
  @ApiProperty()
  attack: number;
  @ApiProperty()
  defense: number;
  @ApiProperty()
  spAttack: number;
  @ApiProperty()
  spDefense: number;
  @ApiProperty()
  speed: number;
  @ApiProperty()
  generation: number;
  @ApiProperty()
  legendary: boolean;

  @ApiProperty()
  image: string;

  @ApiProperty()
  ytbUrl: string;

  private constructor(partial: Partial<PokemonDetailsResultDto>) {
    Object.assign(this, partial);
  }
  static create(entity: Pokemon): PokemonDetailsResultDto;
  static create(entity: Pokemon[]): PokemonDetailsResultDto[];
  static create(
    entity: Pokemon | Pokemon[],
  ): PokemonDetailsResultDto | PokemonDetailsResultDto[] {
    if (Array.isArray(entity)) {
      return entity.map((item) => this.create(item));
    }
    return new PokemonDetailsResultDto({
      id: entity.id,
      name: entity.name,
      types: entity.types.map((type) => PokemonTypeResultDto.create(type)),
      total: entity.total,
      hp: entity.hp,
      attack: entity.attack,
      defense: entity.defense,
      spAttack: entity.spAttack,
      spDefense: entity.spDefense,
      speed: entity.speed,
      generation: entity.generation,
      legendary: entity.legendary,
      image: entity.image,
      ytbUrl: entity.ytbUrl,
    });
  }
}
