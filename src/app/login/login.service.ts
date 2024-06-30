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

    return this.http.post('http://localhost:8080/login', credentials).pipe(
      map((response: any) => {
        if (response && response.token) {
          sessionStorage.setItem('token', response.token);
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
    sessionStorage.removeItem('token');
    this.loginStatusSubject.next(false);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  loginStatus$(): Observable<boolean> {
    return this.loginStatusSubject.asObservable();
  }


  checkValidToken(): Observable<boolean> {
    const token = this.getToken();
    
    if (!token) {
      return of(false);
    }

    return this.http.post('http://localhost:8080/validate/token', {}).pipe(
      map((response: any) => {
        if (response && response.isValid) {
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
}
