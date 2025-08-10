import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseDto } from '@core/http';
import { API_ENDPOINTS } from '@shared/constants';
import { Observable } from 'rxjs';
import { AuthTokensDto, LoginCredentialsDto, RegisterDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly _http = inject(HttpClient);

  register(credentials: RegisterDto): Observable<ResponseDto<AuthTokensDto>> {
    return this._http.post<ResponseDto<AuthTokensDto>>(
      API_ENDPOINTS.AUTH.REGISTER,
      credentials,
    );
  }

  login(
    credentials: LoginCredentialsDto,
  ): Observable<ResponseDto<AuthTokensDto>> {
    return this._http.post<ResponseDto<AuthTokensDto>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
  }

  refresh(refreshToken: string): Observable<ResponseDto<AuthTokensDto>> {
    return this._http.post<ResponseDto<AuthTokensDto>>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken },
    );
  }

  logout(refreshToken: string): Observable<ResponseDto<void>> {
    return this._http.post<ResponseDto<void>>(API_ENDPOINTS.AUTH.LOGOUT, {
      refreshToken,
    });
  }
}
