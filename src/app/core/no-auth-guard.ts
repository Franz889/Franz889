import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';
import { map, tap } from 'rxjs/operators';

export const noAuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    // true si NO hay usuario (entonces sí puede ver /login)
    map(user => !user),
    tap(noUser => {
      if (!noUser) {
        // si SÍ hay usuario autenticado, redirigimos fuera de /login
        router.navigate(['/libros']); // o '/' si prefieres
      }
    })
  );
};
