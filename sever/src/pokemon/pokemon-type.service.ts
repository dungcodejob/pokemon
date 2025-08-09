import { PokemonType } from '@app/entities';
import { PokemonTypeRepository } from '@app/repositories';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
type PokemonTypeCreateInput = ConstructorParameters<typeof PokemonType>[0];

@Injectable()
export class PokemonTypeService {
  constructor(
    @InjectRepository(PokemonTypeRepository)
    private readonly _repository: PokemonTypeRepository,
    private readonly _em: EntityManager,
  ) {}

  create(data: PokemonTypeCreateInput): PokemonType {
    const account = new PokemonType(data);
    return this._repository.create(account);
  }

  flush(): Promise<void> {
    return this._em.flush();
  }
}
