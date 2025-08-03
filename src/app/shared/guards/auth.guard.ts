import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services';
import { map, filter, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    map((user) => {
      if (user) {
        return true;
      } else {
        router.navigate(['/home']);
        return false;
      }
    })
  );
};

export const redirectIfAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for the auth state to be determined and take only the first determined state
  return authService.currentUser$.pipe(
    filter((user) => user !== undefined), // Wait until auth state is determined (not undefined)
    take(1), // Take only the first emission after auth state is determined
    map((user) => {
      if (user) {
        router.navigate(['/featured']);
        return false;
      } else {
        return true;
      }
    })
  );
};
