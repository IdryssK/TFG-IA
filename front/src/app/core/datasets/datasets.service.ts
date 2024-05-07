import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatasetsService {

  constructor(private http: HttpClient) { }

  getDatasets(params): Observable<any> {
    let data = {
      headers: this.cabeceras.headers,
      params: params
  };
    return this.http.get<any>(`${environment.apiUrl}/datasets`, data).pipe(
      map((response) => response),
    );
  }

  getDataset(idx: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/datasets/${idx}`, this.cabeceras).pipe(
      map((response) => response),
    );
  }

  saveDataset(data, diccionario, idx): Observable<any> {
    let params = {
      "DS_CONF_Idx": idx,
      "DS_Dataset": data,
      "DS_Diccionario": diccionario
    };
    return this.http.post<any>(`${environment.apiUrl}/datasets`, params, this.cabeceras, ).pipe(
      map((response) => response),
    );
  }

  deleteDataset(idx): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/datasets/${idx}`, this.cabeceras).pipe(
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
