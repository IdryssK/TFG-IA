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
    console.log(`${environment.apiSmartUA}/tag/${token}/${tag}`)
    return this._httpClient.get(`${environment.apiSmartUA}/tag/${token}/${tag}`).pipe(
      map((response) => {
        console.log(response); 
        return response;
      }),
      catchError((error) => { 
        console.log(error.url);
        return of(error); 
      })
    );
  }

  getDataSmartUa(token: string, tag: string[], selectedValues: string[]): Observable<any> {
    console.log('tag: ', tag, 'values: ', selectedValues)
    console.log(`${environment.apiSmartUA}/data/${token}`);
    this.body = {

        "time_start": "2023-05-18T05:18:38Z", //start
        "time_end": "2023-05-19T05:18:38Z", //end
        "filters": [
          {
            "filter": tag[0], //abra que hacer un for para recorrer todos los tags??
            "values": selectedValues
            
          }
        ], //{"filter": tag, "values": [selectedValues[0], selectedValues[1], selectedValues[2]},
        "limit": 100, // limit
        "count": false // tiene que ser false si queremos ver los datos | true si queremos ver el numero total de datos
    }
    console.log(this.body)
    return this._httpClient.post(`${environment.apiSmartUA}/data/${token}`, this.body);
  }

}

