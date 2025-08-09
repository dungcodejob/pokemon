import { PaginationMetaDto } from './pagination.dto';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type BaseResponseDto = Readonly<{
  statusCode: number;
  message: string;
  description?: string;
  timestamp: string;
  url: string;
  method: HttpMethod;
}>;

export type ErrorResponseDto = {
  success: false;
  errorCode: string;
} & BaseResponseDto;

export type SuccessResponseDto<T> = {
  success: true;
  result: T;
} & BaseResponseDto;

export type ResponseDto<T = unknown> = ErrorResponseDto | SuccessResponseDto<T>;

export type ValidatorErrorDto = {
  property: string;
  constraints?: { [key: string]: string };
};

export type ValidatorResponseDto = {
  readonly errorCode: 'BadRequest';
  readonly result: Readonly<{ meta: { validators: ValidatorErrorDto[] } }>;
} & ErrorResponseDto;

export type SingleResponseDto<T> = SuccessResponseDto<{ data: T }>;
export type ListResponseDto<T> = SuccessResponseDto<{
  items: T[];
  meta: { count: number };
}>;
export type PaginationResponseDto<T> = SuccessResponseDto<{
  items: T[];
  meta: { pagination: PaginationMetaDto };
}>;
