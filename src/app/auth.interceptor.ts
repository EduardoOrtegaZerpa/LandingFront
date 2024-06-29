import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {Observable, catchError, throwError} from 'rxjs';
import {Injectable, Provider} from '@angular/core';
import { LoginService } from './login/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private loginSerivce: LoginService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.loginSerivce.getToken();

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      },
      withCredentials: true
    });

    return next.handle(authReq);
  }
}

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const statusCode = error.status;
        const responseBody = error.error;
        if (statusCode === 401) {
            const hasAuthorizationHeader = request.headers.has('Authorization');
            if (hasAuthorizationHeader) {
                this.loginService.logout();
            }
        }
        return throwError({statusCode, responseBody});
      })
    );
  }
}

export const AuthInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
};

export const ResponseInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ResponseInterceptor,
  multi: true
};

