import {
  FileImport,
  ImportStatus,
  ImportType,
  Pokemon,
  PokemonType,
} from '@app/entities';
import { Errors } from '@app/errors';
import { ImportService } from '@app/import';
import { UNIT_OF_WORK, type UnitOfWork } from '@app/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { PokemonImportOptionDto } from './dto';
import { PokemonCsvRowDto } from './models';
type PokemonCreateInput = ConstructorParameters<typeof Pokemon>[0];
type PokemonTypeCreateInput = ConstructorParameters<typeof PokemonType>[0];
@Injectable()
export class PokemonService {
  constructor(
    @Inject(UNIT_OF_WORK) private readonly _unitOfWork: UnitOfWork,
    private readonly _importService: ImportService,
  ) {}

  async import(
    file: Express.Multer.File,
    accountId: string,
    option: PokemonImportOptionDto,
  ) {
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

  create(data: PokemonCreateInput): Pokemon {
    const account = new Pokemon(data);
    return this._unitOfWork.pokemon.create(account);
  }

  createPokemonType(data: PokemonTypeCreateInput): PokemonType {
    const account = new PokemonType(data);
    return this._unitOfWork.pokemonType.create(account);
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
        const pokemonTypeLinkEntity = this._unitOfWork.pokemonTypeLink.create({
          pokemon: newPokemonEntity,
          type: type1,
          isPrimary: true,
        });
        newPokemonEntity.types.add(pokemonTypeLinkEntity);
      }
      if (type2) {
        const pokemonTypeLinkEntity = this._unitOfWork.pokemonTypeLink.create({
          pokemon: newPokemonEntity,
          type: type2,
          isPrimary: false,
        });
        newPokemonEntity.types.add(pokemonTypeLinkEntity);
      }
      newPokemonEntity.importedFrom = fileImport;
      newPokemonEntities.push(newPokemonEntity);
    }

    return [...newPokemonEntities, ...pokemonEntityExists];
  }
}
