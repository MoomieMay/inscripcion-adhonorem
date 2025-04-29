import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';
import { from, map, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return from(authService.getSession()).pipe(
    map(session => {
      if (session?.user) {
        return true;
      } else {
        return router.parseUrl('/acceso-denegado');
      }
    })
  );
};
