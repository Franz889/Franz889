import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { CategoriasComponent } from './categorias/categorias';
import { LibrosComponent } from './libros/libros'; 
import { DetalleComponent } from './libros/detalle';   

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'libros', component: LibrosComponent },
  { path: 'libros/:id', component: DetalleComponent },       

  {
  path: 'estadisticas',
  loadChildren: () =>
    import('./estadisticas/estadisticas/estadisticas-module')
      .then(m => m.EstadisticasModule)
}

];
