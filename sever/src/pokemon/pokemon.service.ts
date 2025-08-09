import { Pokemon } from '@app/entities';
import { PokemonRepository } from '@app/repositories';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
type PokemonCreateInput = ConstructorParameters<typeof Pokemon>[0];

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(PokemonRepository)
    private readonly _repository: PokemonRepository,
    private readonly _em: EntityManager,
  ) {}

  create(data: PokemonCreateInput): Pokemon {
    const account = new Pokemon(data);
    return this._repository.create(account);
  }

  flush(): Promise<void> {
    return this._em.flush();
  }
}
