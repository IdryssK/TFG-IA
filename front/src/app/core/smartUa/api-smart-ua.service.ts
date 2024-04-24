import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { catchError, map, Observable, ReplaySubject, tap } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiSmartUaService {
  private _httpClient = inject(HttpClient);
  
  constructor(private http: HttpClient) { }

  body: any;
  getTagSmartUa(token: string, tag: string): Observable<any> {

    return this._httpClient.get(`${environment.apiSmartUA}/tag/${token}/${tag}`).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => { 
        console.log(error);
        return of(error); 
      })
    );
  }

  getDataSmartUa(token: string, limite: number, selectedValuesByTag: {[tag: string]: any[]}, start: Date, end: Date): Observable<any> {
    
    //forrmateamos las fechas a 2023-05-02T14:00:00Z
    start = new Date(start);
    end = new Date(end);

    // Creamos un array de filtros
    let filters = [];
    for (let tag in selectedValuesByTag) {
      filters.push({
        "filter": tag,
        "values": selectedValuesByTag[tag]
      });
    }

    //craemos el body
    this.body = {

        "time_start": start.toJSON(), //start
        "time_end": end.toJSON(), //end
        "filters": filters, //{"filter": tag, "values": [selectedValues[0], selectedValues[1], selectedValues[2]},
        "limit": limite, // limit
        "count": false // tiene que ser false si queremos ver los datos | true si queremos ver el numero total de datos
    }
    console.log(this.body)
    return this._httpClient.post(`${environment.apiSmartUA}/data/${token}`, this.body);
  }

  // recogemos el numero total de datos
  getTotalDataCount(token: string, selectedValuesByTag: {[tag: string]: any[]}, start: Date, end: Date): Observable<any> {
    //forrmateamos las fechas a 2023-05-02T14:00:00Z
    start = new Date(start);
    end = new Date(end);

    // Creamos un array de filtros
    let filters = [];
    for (let tag in selectedValuesByTag) {
      filters.push({
        "filter": tag,
        "values": selectedValuesByTag[tag]
      });
    }

    //craemos el body
    this.body = {

        "time_start": start.toJSON(), //start
        "time_end": end.toJSON(), //end
        "filters": filters, //{"filter": tag, "values": [selectedValues[0], selectedValues[1], selectedValues[2]},
        "limit": 100, // limit
        "count": true // tiene que ser false si queremos ver los datos | true si queremos ver el numero total de datos
    }
  
    return this._httpClient.post(`${environment.apiSmartUA}/data/${token}`, this.body);
  }
}


// funcion que llame a la api de smartua/data/token pero que me ponga el count a true
// y que me devuelva el numero de datos que hay en el token

// funcion que llame a la api de smartua/data/token pero que me ponga el count a false


