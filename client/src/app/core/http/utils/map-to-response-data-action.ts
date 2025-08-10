import { map, Observable, OperatorFunction } from 'rxjs';
import { PKApiError } from '../models/api-error';
import { ResponseDto } from '../models/response.dto';

export function mapToResponseDataAction<K, TSuccessAction>(
  successActionCreator: (data: K) => TSuccessAction,
): OperatorFunction<ResponseDto<K>, TSuccessAction> {
  return (source$: Observable<ResponseDto<K>>): Observable<TSuccessAction> =>
    source$.pipe(
      map((res) => {
        if (res.success) {
          return successActionCreator(res.result);
        } else {
          throw PKApiError.fromResponse(res);
        }
      }),
    );
}
