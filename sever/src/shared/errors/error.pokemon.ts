import { NotFoundException } from '@nestjs/common';

export class Pokemon {
  static NotFound = new NotFoundException('Pokemon.NotFound');
  static FavoriteNotFound = new NotFoundException('Pokemon.FavoriteNotFound');
}
