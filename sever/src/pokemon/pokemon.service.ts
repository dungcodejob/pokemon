import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from '@app/constants';
import {
  FileImport,
  ImportStatus,
  ImportType,
  Pokemon,
  PokemonFavorite,
  PokemonType,
  User,
} from '@app/entities';
import { Errors } from '@app/errors';
import { ImportService } from '@app/import';
import { PaginationDto } from '@app/models';
import { UNIT_OF_WORK, type UnitOfWork } from '@app/repositories';
import { UserService } from '@app/user';
import { FilterQuery, FindOptions } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';
import { PokemonImportOptionDto } from './dto';
import { PokemonDetailsResultDto } from './dto/pokemon-details-result.dto';
import { PokemonFilterDto } from './dto/pokemon-filter.dto';
import { PokemonResultDto } from './dto/pokemon-result.dto';
import { PokemonCsvRowDto } from './models';
type PokemonCreateInput = ConstructorParameters<typeof Pokemon>[0];
type PokemonTypeCreateInput = ConstructorParameters<typeof PokemonType>[0];
@Injectable()
export class PokemonService {
  constructor(
    @Inject(UNIT_OF_WORK) private readonly _unitOfWork: UnitOfWork,
    private readonly _importService: ImportService,
    private readonly _userService: UserService,
  ) {}

  async import(
    file: Express.Multer.File,
    accountId: string,
    option: PokemonImportOptionDto,
  ): Promise<FileImport> {
    const fileImport = await this._importService.createFileImport(
      file,
      accountId,
      ImportType.Pokemon,
    );
    await this._importService.flush();

    const parsedData = await this._importService.parseCsvFile(file, {
      headers: [
        'id',
        'name',
        'type1',
        'type2',
        'total',
        'hp',
        'attack',
        'defense',
        'specialAttack',
        'specialDefense',
        'speed',
        'generation',
        'legendary',
        'image',
        'ytbUrl',
      ],
      skipLines: 1,
    });

    if (parsedData.length === 0) {
      throw Errors.File.Empty;
    }

    const { data, errors } = await this._importService.validateRowData(
      parsedData,
      PokemonCsvRowDto,
    );

    fileImport.totalRows = data.length + errors.length;
    fileImport.processedRows = data.length;
    fileImport.failedRows = errors.length;
    await this._unitOfWork.save();

    await this._unitOfWork.start();
    try {
      const newPokemonType = await this.handleImportPokemonType(
        data,
        fileImport,
        option.isSkipPokemonTypeDuplicates,
      );
      const newPokemon = await this.handleImportPokemon(
        data,
        newPokemonType,
        fileImport,
        option.isSkipPokemonDuplicates,
      );

      fileImport.processedRows = 0;
      fileImport.successRows = data.length;
      fileImport.status = ImportStatus.Completed;
      // await this._unitOfWork.save();
    } catch (error) {
      await this._unitOfWork.rollback();
      fileImport.failedRows = fileImport.totalRows;
      fileImport.processedRows = 0;
      fileImport.successRows = 0;
      fileImport.status = ImportStatus.Failed;
      await this._unitOfWork.save();
      throw error;
    }

    await this._unitOfWork.commit();

    return fileImport;
  }

  async find(filter: PokemonFilterDto): Promise<PokemonResultDto[]> {
    const query = this.createFilterQuery(filter);
    const options = this.createFilterOptions(filter);

    const entities = await this._unitOfWork.pokemon.find(query, options);
    return PokemonResultDto.create(entities);
  }

  async findOne(id: string): Promise<PokemonDetailsResultDto> {
    const entity = await this._unitOfWork.pokemon.findOne(
      {
        id,
        deleteFlag: false,
      },
      {
        populate: ['types'],
      },
    );

    if (!entity) {
      throw Errors.Pokemon.NotFound;
    }
    return PokemonDetailsResultDto.create(entity);
  }

  async count(filter: PokemonFilterDto): Promise<number> {
    const query = this.createFilterQuery(filter);
    return this._unitOfWork.pokemon.count(query);
  }

  async findTypes(): Promise<PokemonType[]> {
    return this._unitOfWork.pokemonType.find({
      deleteFlag: false,
    });
  }

  async findFavorites(
    accountId: string,
    pagination: PaginationDto,
  ): Promise<PokemonResultDto[]> {
    const user = await this._userService.findOneByAccountId(accountId);
    if (!user) {
      throw Errors.User.UserNotFound;
    }
    const entities = await this._unitOfWork.pokemon.find(
      {
        favorites: {
          user: {
            id: user.id,
          },
          deleteFlag: false,
        },
        deleteFlag: false,
      },
      {
        populate: ['types'],
        limit: pagination.pageSize,
        offset: (pagination.currentPage - 1) * pagination.pageSize,
      },
    );

    return PokemonResultDto.create(entities);
  }

  create(data: PokemonCreateInput): Pokemon {
    const account = new Pokemon(data);
    return this._unitOfWork.pokemon.create(account);
  }

  createPokemonType(data: PokemonTypeCreateInput): PokemonType {
    const account = new PokemonType(data);
    return this._unitOfWork.pokemonType.create(account);
  }

  async toggleFavorite(accountId: string, pokemonId: string) {
    const user = await this._userService.findOneByAccountId(accountId);
    if (!user) {
      throw Errors.User.UserNotFound;
    }
    const favorite = await this._unitOfWork.pokemonFavorite.findOne({
      pokemon: {
        id: pokemonId,
      },
      user: {
        id: user.id,
      },
      deleteFlag: false,
    });

    if (favorite) {
      await this.unmarkAsFavorite(favorite);
    } else {
      await this.markAsFavorite(pokemonId, user);
    }
    await this._unitOfWork.save();
  }

  private async markAsFavorite(pokemonId: string, user: User) {
    const pokemon = this._unitOfWork.pokemon.getReference(pokemonId);
    const favorite = new PokemonFavorite();
    favorite.pokemon = pokemon;
    favorite.user = user;

    return this._unitOfWork.pokemonFavorite.create(favorite);
  }

  private async unmarkAsFavorite(favorite: PokemonFavorite) {
    favorite.deleteFlag = true;
  }

  private createFilterQuery(filter: PokemonFilterDto): FilterQuery<Pokemon> {
    const query: FilterQuery<Pokemon> = {
      deleteFlag: false,
    };

    if (filter.name) {
      query.name = {
        $like: `%${filter.name}%`,
      };
    }

    if (filter.typeIds) {
      query.types = {
        id: {
          $in: filter.typeIds,
        },
      };
    }

    if (filter.ranges) {
      for (const range of filter.ranges) {
        if (range.min) {
          query[range.filterBy] = {
            $gte: range.min,
          };
        }
        if (range.max) {
          query[range.filterBy] = {
            $lte: range.max,
          };
        }
        if (range.exact) {
          query[range.filterBy] = {
            $eq: range.exact,
          };
        }
      }
    }
    if (filter.legendary) {
      query.legendary = filter.legendary;
    }

    return query;
  }

  private createFilterOptions(
    filter: PokemonFilterDto,
  ): FindOptions<Pokemon, 'types', '*', never> {
    const options: FindOptions<Pokemon, 'types', '*', never> = {
      populate: ['types'],
    };

    if (filter.sort) {
      const { sortBy, order } = filter.sort;
      options.orderBy = {
        [sortBy]: order,
      };
    }

    const currentPage = filter.pagination?.currentPage || DEFAULT_CURRENT_PAGE;
    const pageSize = filter.pagination?.pageSize || DEFAULT_PAGE_SIZE;

    options.limit = pageSize;
    options.offset = (currentPage - 1) * pageSize;

    return options;
  }

  async flush(): Promise<void> {
    await this._unitOfWork.save();
  }

  private async handleImportPokemonType(
    data: PokemonCsvRowDto[],
    fileImport: FileImport,
    isSkipDuplicates: boolean,
  ): Promise<PokemonType[]> {
    const pokemonTypes = new Set<string>();
    for (const item of data) {
      if (item.type1) {
        pokemonTypes.add(item.type1);
      }
      if (item.type2) {
        pokemonTypes.add(item.type2);
      }
    }

    let newPokemonTypes: string[] = [];
    let pokemonTypeEntityExists: PokemonType[] = [];

    if (isSkipDuplicates) {
      pokemonTypeEntityExists = await this._unitOfWork.pokemonType.find({
        name: {
          $in: [...pokemonTypes],
        },
      });

      for (const item of [...pokemonTypes]) {
        if (!pokemonTypeEntityExists.find((type) => type.name === item)) {
          newPokemonTypes.push(item);
        }
      }
    } else {
      newPokemonTypes = Array.from(pokemonTypes);
    }

    const newPokemonTypeEntities = newPokemonTypes.map((type) => {
      const typeEntity = this.createPokemonType({ name: type });
      typeEntity.importedFrom = fileImport;
      return typeEntity;
    });

    return [...newPokemonTypeEntities, ...pokemonTypeEntityExists];
  }

  private async handleImportPokemon(
    data: PokemonCsvRowDto[],
    pokemonTypeEntities: PokemonType[],
    fileImport: FileImport,
    isSkipDuplicates: boolean,
  ): Promise<Pokemon[]> {
    const pokemonNames = new Set<string>();
    for (const item of data) {
      if (item.name) {
        pokemonNames.add(item.name);
      }
    }

    let newPokemon: PokemonCsvRowDto[] = [];
    let pokemonEntityExists: Pokemon[] = [];
    if (isSkipDuplicates) {
      pokemonEntityExists = await this._unitOfWork.pokemon.find({
        name: {
          $in: [...pokemonNames],
        },
      });

      const newPokemonNames: string[] = [];
      for (const item of [...pokemonNames]) {
        if (!pokemonEntityExists.find((type) => type.name === item)) {
          newPokemonNames.push(item);
        }
      }
      newPokemon = data.filter((item) => newPokemonNames.includes(item.name));
    } else {
      newPokemon = data;
    }

    const newPokemonEntities: Pokemon[] = [];
    for (const item of newPokemon) {
      const newPokemonEntity = this.create({
        name: item.name,
        total: item.total,
        hp: item.hp,
        attack: item.attack,
        defense: item.defense,
        spAttack: item.specialAttack,
        spDefense: item.specialDefense,
        speed: item.speed,
        generation: item.generation,
        legendary: item.legendary,
        image: item.image,
        ytbUrl: item.ytbUrl,
      });
      const type1 = pokemonTypeEntities.find(
        (type) => type.name === item.type1,
      );
      const type2 = pokemonTypeEntities.find(
        (type) => type.name === item.type2,
      );
      if (type1) {
        newPokemonEntity.types.add(type1);
      }
      if (type2) {
        newPokemonEntity.types.add(type2);
      }
      newPokemonEntity.importedFrom = fileImport;
      newPokemonEntities.push(newPokemonEntity);
    }

    return [...newPokemonEntities, ...pokemonEntityExists];
  }
}
