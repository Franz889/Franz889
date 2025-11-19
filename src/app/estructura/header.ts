import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header style="background:#c62828; color:white; padding:10px 16px;">
      <strong style="margin-right:16px">Biblioteca Virtual</strong>
      <a routerLink="/" style="color:white; margin-right:8px; text-decoration:none">Inicio</a>
      <a routerLink="/categorias" style="color:white; text-decoration:none">Categorías</a>
      <a routerLink="/libros" style="color:white; margin-left:8px; text-decoration:none">Libros</a>
      <a routerLink="/estadisticas" style="color:white; margin-left:8px; text-decoration:none">Estadísticas</a>
    </header>
  `,
})
export class HeaderComponent {}
