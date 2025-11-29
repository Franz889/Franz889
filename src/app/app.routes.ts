import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { CategoriasComponent } from './categorias/categorias';
import { LibrosComponent } from './libros/libros';
import { DetalleComponent } from './libros/detalle';
import { NotFoundComponent } from './not-found/not-found';

import { AuthComponent } from './auth/auth/auth';
import { authGuard } from './core/auth-guard';
import { noAuthGuard } from './core/no-auth-guard';

export const routes: Routes = [
  // ⬇️ Ahora Inicio también está protegido
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [authGuard] },

  // Login solo para NO autenticados
  { path: 'login', component: AuthComponent, canActivate: [noAuthGuard] },

  // Rutas protegidas
  { path: 'categorias', component: CategoriasComponent, canActivate: [authGuard] },
  { path: 'libros', component: LibrosComponent, canActivate: [authGuard] },
  { path: 'libros/:id', component: DetalleComponent, canActivate: [authGuard] },

  {
    path: 'estadisticas',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./estadisticas/estadisticas/estadisticas-module')
        .then(m => m.EstadisticasModule),
  },

  // 404
  { path: '**', component: NotFoundComponent },
];
