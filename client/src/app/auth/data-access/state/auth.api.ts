import { inject, Injectable } from '@angular/core';
import { HttpService, ResponseDto, SingleResponseDto } from '@core/http';
import { API_ENDPOINTS } from '@shared/constants';
import { Observable } from 'rxjs';
import { AuthResultDto, LoginCredentialsDto, RegisterDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly _http = inject(HttpService);

  register(credentials: RegisterDto): Observable<ResponseDto<AuthResultDto>> {
    return this._http.post<ResponseDto<AuthResultDto>>(
      API_ENDPOINTS.AUTH.REGISTER,
      credentials,
    );
  }

  login(
    credentials: LoginCredentialsDto,
  ): Observable<SingleResponseDto<AuthResultDto>> {
    return this._http.post<SingleResponseDto<AuthResultDto>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
  }

  refresh(refreshToken: string): Observable<SingleResponseDto<AuthResultDto>> {
    return this._http.post<SingleResponseDto<AuthResultDto>>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken },
    );
  }

  logout(refreshToken: string): Observable<SingleResponseDto<void>> {
    return this._http.post<SingleResponseDto<void>>(API_ENDPOINTS.AUTH.LOGOUT, {
      refreshToken,
    });
  }
}
