import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from '@app/constants';
import { CurrentAccount } from '@app/decorators';
import { FastifyFileInterceptor } from '@app/interceptors';
import { Result } from '@app/models';
import { editFileName, importDataFileFilter } from '@app/utils';
import {
  Body,
  Controller,
  Post,
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
  async search(@Body() filter: PokemonFilterDto) {
    const pagination = filter.pagination || {
      currentPage: DEFAULT_CURRENT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    };

    const result = await this._pokemonService.findAll(filter);
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
}
