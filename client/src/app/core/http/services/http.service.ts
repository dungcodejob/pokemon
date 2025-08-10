import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { AppConfigService } from '@core/config';
import { Observable } from 'rxjs';
import { ResponseDto } from '../models/response.dto';

type HttpOptions = {
  headers?: HttpHeaders | Record<string, string | string[]>;
  context?: HttpContext;
  observe?: 'body';
  params?:
    | HttpParams
    | Record<
        string,
        string | number | boolean | readonly (string | number | boolean)[]
      >;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  transferCache?:
    | {
        includeHeaders?: string[];
      }
    | boolean;
};

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  readonly http = inject(HttpClient);

  readonly options = { withCredentials: true };
  readonly appConfigService = inject(AppConfigService);
  readonly $baseUrl = computed(() => {
    const config = this.appConfigService.$config();
    return config.apiBaseUrl;
  });

  get<T extends ResponseDto>(
    url: string,
    options?: Partial<HttpOptions>,
  ): Observable<T> {
    const mergedOptions = this._mergeOptions(options);
    return this.http.get<T>(this.$baseUrl() + url, mergedOptions);
  }

  put<T extends ResponseDto, K = unknown>(
    url: string,
    body: K,
    options?: Partial<HttpOptions>,
  ): Observable<T> {
    const mergedOptions = this._mergeOptions(options);
    return this.http.put<T>(this.$baseUrl() + url, body, mergedOptions);
  }

  post<T extends ResponseDto, K = unknown>(
    url: string,
    body: K,
    options?: Partial<HttpOptions>,
  ): Observable<T> {
    const mergedOptions = this._mergeOptions(options);
    return this.http.post<T>(this.$baseUrl() + url, body, mergedOptions);
  }

  delete<T extends ResponseDto>(
    url: string,
    options?: Partial<HttpOptions>,
  ): Observable<T> {
    const mergedOptions = this._mergeOptions(options);
    return this.http.delete<T>(this.$baseUrl() + url, mergedOptions);
  }

  private _mergeOptions(options?: HttpOptions): HttpOptions {
    return {
      ...this.options,
      ...options,
    };
  }
}
