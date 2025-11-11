import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { CategoriasComponent } from './categorias/categorias';
import { LibrosComponent } from './libros/libros'; 

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'libros', component: LibrosComponent },        
];
