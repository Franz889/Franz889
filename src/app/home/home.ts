import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section style="
      padding: 40px 20px;
      max-width: 960px;
      margin: 0 auto;
    ">
      <!-- Hero -->
      <div style="margin-bottom: 32px;">
        <h1 style="font-size: 32px; margin-bottom: 8px; display:flex; align-items:center; gap:8px;">
          <span style="font-size: 32px;">📚</span>
          <span>Biblioteca Virtual</span>
        </h1>
        <p style="font-size: 15px; opacity: .9; max-width: 620px;">
          Administra tus libros y categorías en la nube con Angular y Firebase.
          Registra tus préstamos, consulta el catálogo y revisa estadísticas básicas de forma sencilla.
        </p>
      </div>

      <!-- Atajos principales -->
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
      ">
        <!-- Tarjeta Libros -->
        <article style="
          background: #fafafa;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,.08);
        ">
          <h2 style="font-size: 18px; margin-bottom: 6px;">📘 Gestión de libros</h2>
          <p style="font-size: 14px; opacity: .85; margin-bottom: 10px;">
            Agrega, edita y elimina libros de tu biblioteca virtual. Filtra por título, autor o categoría.
          </p>
          <a routerLink="/libros"
             style="display:inline-block; padding:6px 12px; background:#c62828; color:white;
                    text-decoration:none; border-radius:4px; font-size:13px;">
            Ir a Libros
          </a>
        </article>

        <!-- Tarjeta Categorías -->
        <article style="
          background: #fafafa;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,.08);
        ">
          <h2 style="font-size: 18px; margin-bottom: 6px;">📂 Categorías</h2>
          <p style="font-size: 14px; opacity: .85; margin-bottom: 10px;">
            Organiza tus libros por áreas como Programación, Matemática, Literatura, etc.
          </p>
          <a routerLink="/categorias"
             style="display:inline-block; padding:6px 12px; background:#1565c0; color:white;
                    text-decoration:none; border-radius:4px; font-size:13px;">
            Ver categorías
          </a>
        </article>

        <!-- Tarjeta Estadísticas -->
        <article style="
          background: #fafafa;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,.08);
        ">
          <h2 style="font-size: 18px; margin-bottom: 6px;">📊 Estadísticas</h2>
          <p style="font-size: 14px; opacity: .85; margin-bottom: 10px;">
            Revisa el total de libros, categorías y el resumen por categoría.
          </p>
          <a routerLink="/estadisticas"
             style="display:inline-block; padding:6px 12px; background:#2e7d32; color:white;
                    text-decoration:none; border-radius:4px; font-size:13px;">
            Ver estadísticas
          </a>
        </article>
      </div>
    </section>
  `,
})
export class HomeComponent {}
