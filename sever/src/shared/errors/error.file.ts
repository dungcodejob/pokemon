import { BadRequestException } from '@nestjs/common';

export class File {
  static NotFormData = new BadRequestException('File.NotFormData');
  static TypeNotSupported = new BadRequestException('File.TypeNotSupported');
  static Empty = new BadRequestException('File.Empty');
}
