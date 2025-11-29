import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';
import { map, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    map(user => !!user),   // true si hay usuario autenticado
    tap(isLogged => {
      if (!isLogged) {
        router.navigate(['/login']); // enviar al login si no hay sesión
      }
    })
  );
};
