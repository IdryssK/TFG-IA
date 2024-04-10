import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment.development';
import { map, Observable, ReplaySubject, Subject, takeUntil, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService
{
    private _httpClient = inject(HttpClient);
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    userConnected: User;

    constructor(private http: HttpClient){}
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current signed-in user data
     */
    get(): Observable<User>
    {
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) =>
            {
                this._user.next(user);
            }),
        );
    }

    setConnectedUser(): void {
        this.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) =>
            {
                this.userConnected = user;
                // console.log(this.user);
                // Mark for check
                // this._changeDetectorRef.markForCheck();
            });
    }

    getConnectedUser(): User {
        return this.userConnected;
    }
    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any>
    {
        return this._httpClient.patch<User>('api/common/user', {user}).pipe(
            map((response) =>
            {
                this._user.next(response);
            }),
        );
    }

    // function for get all users
    getAll(params): Observable<any> {

        console.log(this.cabeceras.headers.accessToken);
        let data = {
            headers: this.cabeceras.headers,
            params: params
        }
        console.log(data);
        return this.http.get<any>(`${environment.apiUrl}/users`, data).pipe(
            map((response) => response),
        );
    }

    getUser(id: number): Observable<any> {

        return this.http.get<any>(`${environment.apiUrl}/users/${id}`, this.cabeceras).pipe(
            map((response) => response),
        );
    }

    updateUser(user:{email: string, password: string, rol: number}, id: number): Observable<any> {

        return this.http.put<any>(`${environment.apiUrl}/users/${id}`, user, this.cabeceras).pipe(
            map((response) => response),
        );
    }

    deleteUser(id: number): Observable<any> {
        
        return this.http.delete<any>(`${environment.apiUrl}/users/${id}`, this.cabeceras).pipe(
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
