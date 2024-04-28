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

  configuracionList(): Observable<any> {

    return this.http.get<any>(`${environment.apiUrl}/configuraciones`, this.cabeceras).pipe(
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


