import { map, Observable, OperatorFunction } from 'rxjs';
import { PKApiError } from '../models/api-error';
import { ResponseDto } from '../models/response.dto';

export function mapToResponseDataAction<K, TSuccessAction>(
  successActionCreator: (data: K) => TSuccessAction,
): OperatorFunction<ResponseDto<K>, TSuccessAction> {
  return (source$: Observable<ResponseDto<K>>): Observable<TSuccessAction> =>
    source$.pipe(
      map((res) => {
        if (!isResponseDto(res)) {
          throw new Error('Unsupported response type');
        }

        if (res.success) {
          return successActionCreator(res.result);
        } else {
          throw PKApiError.fromResponse(res);
        }
      }),
    );
}

function isResponseDto<T extends ResponseDto<any>>(
  response: any,
): response is T {
  return !!response && 'result' in response && response.success === true;
}
