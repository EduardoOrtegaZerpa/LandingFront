import {HttpErrorResponse} from '@angular/common/http';
import {catchError, finalize, throwError} from 'rxjs';
import { HttpInterceptorFn } from '@angular/common/http';
import { LoadingService } from './loading/loading.service';
import { inject } from '@angular/core';

export const LoaderInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);
    
    loadingService.show();
    
    return next(req).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => {
        loadingService.hide();
      })
    );
  };

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const authToken = sessionStorage.getItem('token');
    
    if (!authToken) {
        return next(req);
    }
    
    const authReq = req.clone({
        setHeaders: {
        Authorization: `Bearer ${authToken}`
        },
        withCredentials: true
    });
    
    return next(authReq);
};

export const ResponseInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const statusCode = error.status;
            const responseBody = error.error;
            if (statusCode === 401) {
                const hasAuthorizationHeader = req.headers.has('Authorization');
                if (hasAuthorizationHeader) {
                    sessionStorage.removeItem('token');
                    window.location.reload();
                }
            }
            return throwError(() => error);
        })
    );
};

