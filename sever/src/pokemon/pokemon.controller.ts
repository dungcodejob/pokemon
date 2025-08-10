import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from '@app/constants';
import { CurrentAccount } from '@app/decorators';
import { FastifyFileInterceptor } from '@app/interceptors';
import { PaginationDto, Result } from '@app/models';
import { editFileName, importDataFileFilter } from '@app/utils';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'fastify-multer';
import { PokemonImportOptionDto } from './dto';
import { PokemonFilterDto } from './dto/pokemon-filter.dto';
import { PokemonService } from './pokemon.service';

@ApiTags('pokemon')
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly _pokemonService: PokemonService) {}

  @Post('/import/upload')
  @UseInterceptors(
    FastifyFileInterceptor('file', {
      storage: diskStorage({
        destination: './upload/pokemon',
        filename: editFileName,
      }),
      fileFilter: importDataFileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload pokemon CSV file' })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @CurrentAccount('id') id: string,
    @Body() option: PokemonImportOptionDto,
  ) {
    const fileImport = await this._pokemonService.import(file, id, option);

    return Result.toSingle(fileImport);
  }

  @Post('/')
  @ApiOperation({ summary: 'Search Pokemon with filters' })
  async find(@Body() filter: PokemonFilterDto) {
    const pagination = filter.pagination || {
      currentPage: DEFAULT_CURRENT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    };

    const result = await this._pokemonService.find(filter);
    const totalCount = await this._pokemonService.count(filter);

    return Result.toPagination(result, {
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pagination.pageSize),
      hasPrevious: pagination.currentPage > 1,
      hasNext:
        pagination.currentPage < Math.ceil(totalCount / pagination.pageSize),
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Pokemon by id' })
  async findOne(@Param('id') id: string) {
    const result = await this._pokemonService.findOne(id);
    return Result.toSingle(result);
  }

  @Get('/types')
  @ApiOperation({ summary: 'Get all types' })
  async findTypes() {
    const result = await this._pokemonService.findTypes();
    return Result.toList(result);
  }

  @Post('/:id/favorite')
  @ApiOperation({ summary: 'Toggle favorite' })
  async toggleFavorite(
    @CurrentAccount('id') accountId: string,
    @Param('id') pokemonId: string,
  ) {
    await this._pokemonService.toggleFavorite(accountId, pokemonId);
  }

  @Get('/favorites')
  @ApiOperation({ summary: 'Get favorites' })
  async findFavorites(
    @CurrentAccount('id') accountId: string,
    @Query() pagination: PaginationDto,
  ) {
    const result = await this._pokemonService.findFavorites(
      accountId,
      pagination,
    );
    return Result.toSingle(result);
  }
}
