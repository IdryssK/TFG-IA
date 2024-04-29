import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { catchError, map, Observable, ReplaySubject, tap } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesService {
  private _httpClient = inject(HttpClient);
  
  constructor(private http: HttpClient) { }

  configuracionList(params): Observable<any> {

    console.log(this.cabeceras.headers.accessToken);
    let data = {
        headers: this.cabeceras.headers,
        params: params
    };
    return this.http.get<any>(`${environment.apiUrl}/configuraciones`, data).pipe(
        map((response) => response),
    );
  }

  getConfiguracion(idx: number): Observable<any> {
  
    return this.http.get<any>(`${environment.apiUrl}/configuraciones/${idx}`, this.cabeceras).pipe(
        map((response) => response),
    );
  }

  saveConfiguracion(data): Observable<any> {
    let params = {
      "CONF_Data": data
    };
    return this.http.post<any>(`${environment.apiUrl}/configuraciones`, params, this.cabeceras).pipe(
      map((response) => response),
    );
  }

  deleteConfiguracion(idx): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/configuraciones/${idx}`, this.cabeceras).pipe(
      map((response) => response),
    );
  }
  
  copyConfiguracion(data): Observable<any> {
    let params = {
      "CONF_Data": data
    };
    return this.http.post<any>(`${environment.apiUrl}/configuraciones`, params, this.cabeceras).pipe(
      map((response) => response),
    );
  }

  updateConfiguracion(idx, data): Observable<any> {
    let params = {
      "CONF_Data": data
    };
    console.log(params);
    return this.http.put<any>(`${environment.apiUrl}/configuraciones/${idx}`, params, this.cabeceras).pipe(
      map((response) => response),
    );
  }
  
  get cabeceras() {
    return {
      headers: {
        'accessToken': this.token
      }};
  }
  get token(): string {
    return localStorage.getItem('accessToken') || '';
  }
  
}


// funcion que llame a la api de smartua/data/token pero que me ponga el count a true
// y que me devuelva el numero de datos que hay en el token

// funcion que llame a la api de smartua/data/token pero que me ponga el count a false


