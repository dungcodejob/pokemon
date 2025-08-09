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
}
