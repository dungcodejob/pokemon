import { DEFAULT_ERROR_MESSAGE } from '@shared/constants';
import { ErrorResponseDto } from './response.dto';

export class PKApiError extends Error {
  private constructor(
    override readonly message: string,
    readonly data: ErrorResponseDto | null = null,
    readonly route?: string,
  ) {
    super(message);
    this.name = 'MCApiError';
  }

  static fromResponse(
    res: ErrorResponseDto,
    options?: {
      defaultMessage?: string;
    },
  ): PKApiError {
    return new PKApiError(
      res.message || options?.defaultMessage || DEFAULT_ERROR_MESSAGE,
      res,
      res.url,
    );
  }

  static is(error: unknown): error is PKApiError {
    if (error instanceof PKApiError && error.name === 'MCApiError') {
      return true;
    }
    return false;
  }
}
