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
  //function to get the data from the API y recoger errores


  getTagSmartUa(token: string, tag: string): Observable<any> {
    console.log(`${environment.apiSmartUA}/tag/${token}/${tag}`)
    return this._httpClient.get(`${environment.apiSmartUA}/tag/${token}/${tag}`).pipe(
      map((response) => {
        console.log(response); 
        return response;
      }),
      catchError((error) => { 
        console.log(error.url);
        return of(error); // Devuelve el error como un Observable
      })
    );
  }

}
