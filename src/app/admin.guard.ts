import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LoginService } from './login/login.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const authService = inject(LoginService);
  const router = inject(Router);

  return authService.checkValidToken().pipe(
    switchMap(() => authService.loginStatus$()),
    switchMap((isLoggedIn: boolean): Observable<boolean | UrlTree> => {
      if (isLoggedIn) {
        return of(true);
      } else {
        return of(router.createUrlTree(['/notAvailable']));
      }
    }),
    catchError(() => {
      return of(router.createUrlTree(['/notAvailable']));
    })
  ) as Observable<boolean | UrlTree>;
};
