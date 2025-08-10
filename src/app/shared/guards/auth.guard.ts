import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services';
import { map, filter, take, switchMap } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isInitialized$.pipe(
    filter((isInitialized) => isInitialized),
    take(1),
    switchMap(() =>
      authService.user$.pipe(
        map((user) => {
          if (user) {
            return true;
          } else {
            router.navigate(['/home']);
            return false;
          }
        })
      )
    )
  );
};

export const redirectIfAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isInitialized$.pipe(
    filter((isInitialized) => isInitialized),
    take(1),
    switchMap(() =>
      authService.currentUser$.pipe(
        filter((user) => user !== undefined),
        take(1),
        map((user) => {
          if (user) {
            router.navigate(['/following']);
            return false;
          } else {
            return true;
          }
        })
      )
    )
  );
};
