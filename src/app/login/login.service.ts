import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) {}

  private loginStatusSubject = new BehaviorSubject<boolean>(false);

  login(credentials: {email: string, password: string}) {
    return this.http.post('http://localhost:3000/login', credentials).subscribe((response: any) => {
      if (response.token) {
        localStorage.setItem('token', response.token);
        this.loginStatusSubject.next(true);
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.loginStatusSubject.next(false);
  }

  loginStatus$(): Observable<boolean> {
    return this.loginStatusSubject.asObservable();
  }


}
