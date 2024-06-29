import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) {}

  private loginStatusSubject = new BehaviorSubject<boolean>(false);

  login(credentials: {username: string, password: string}): Observable<boolean> {

    console.log(credentials);
    return this.http.post('http://localhost:8080/login', credentials).pipe(
      map((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.loginStatusSubject.next(true);
          return true;
        }
        return false;
      }),
      catchError(() => {
        return of(false);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.loginStatusSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  loginStatus$(): Observable<boolean> {
    return this.loginStatusSubject.asObservable();
  }
}
