import { Pokemon, PokemonType } from '@app/entities';
import { ApiProperty } from '@nestjs/swagger';

export class PokemonResultDto {
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

  private constructor(partial: Partial<PokemonResultDto>) {
    Object.assign(this, partial);
  }
  static create(entity: Pokemon): PokemonResultDto;
  static create(entity: Pokemon[]): PokemonResultDto[];
  static create(
    entity: Pokemon | Pokemon[],
  ): PokemonResultDto | PokemonResultDto[] {
    if (Array.isArray(entity)) {
      return entity.map((item) => this.create(item));
    }
    return new PokemonResultDto({
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
