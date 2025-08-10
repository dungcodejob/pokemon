import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  HttpService,
  ListResponseDto,
  PaginationDto,
  PaginationResponseDto,
  ResponseDto,
  SingleResponseDto,
} from '@core/http';
import { API_ENDPOINTS } from '@shared/constants';
import { delay, Observable } from 'rxjs';
import {
  PokemonDetailsDto,
  PokemonResultDto,
  PokemonTypeResultDto,
} from '../models';
import { PokemonFilterDto } from '../models/pokemon-filter.dto';

@Injectable({
  providedIn: 'root',
})
export class PKPokemonApi {
  private readonly _http = inject(HttpService);

  find(
    filter: PokemonFilterDto,
  ): Observable<PaginationResponseDto<PokemonResultDto>> {
    return this._http
      .post<
        PaginationResponseDto<PokemonResultDto>
      >(API_ENDPOINTS.POKEMON.FIND, filter)
      .pipe(delay(300));
  }

  findOne(id: number): Observable<SingleResponseDto<PokemonDetailsDto>> {
    return this._http.get<SingleResponseDto<PokemonDetailsDto>>(
      `${API_ENDPOINTS.POKEMON.FIND_ONE}/${id}`,
    );
  }

  findTypes(): Observable<ListResponseDto<PokemonTypeResultDto>> {
    return this._http.get<ListResponseDto<PokemonTypeResultDto>>(
      API_ENDPOINTS.POKEMON.FIND_TYPES,
    );
  }

  findFavorites(
    pagination: PaginationDto,
  ): Observable<ListResponseDto<PokemonResultDto>> {
    const params = new HttpParams();
    params.append('currentPage', pagination.currentPage);
    params.append('pageSize', pagination.pageSize);

    return this._http.get<ListResponseDto<PokemonResultDto>>(
      API_ENDPOINTS.POKEMON.FIND_FAVORITES,
      { params },
    );
  }

  toggleFavorite(pokemonId: string): Observable<ResponseDto> {
    return this._http.post<ResponseDto>(
      API_ENDPOINTS.POKEMON.TOGGLE_FAVORITE(pokemonId),
      null,
    );
  }
}
