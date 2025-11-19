// src/app/libros/detalle.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../core/firestore';
import { Libro, Categoria } from '../core/models';
import { EstadoLibroPipe } from '../core/estado.pipe';

@Component({
  selector: 'app-detalle-libro',
  standalone: true,
  imports: [CommonModule, EstadoLibroPipe],
  template: `
    <section style="padding:16px; max-width:720px; margin:auto">
      <a href="/libros" style="display:inline-block; margin-bottom:8px;">⬅ Volver a libros</a>

      <h2>📖 Detalle de libro</h2>

      <p *ngIf="cargando">Cargando libro...</p>
      <p *ngIf="error" style="color:#b91c1c;">{{ error }}</p>

      <div *ngIf="libro && !cargando" style="margin-top:12px; border:1px solid #e5e7eb; padding:12px; border-radius:8px;">
        <h3 style="margin-top:0;">{{ libro.titulo }}</h3>
        <p><strong>Autor:</strong> {{ libro.autor || '–' }}</p>
        <p><strong>Año:</strong> {{ libro.anio || '–' }}</p>
        <p><strong>Categoría:</strong> {{ getNombreCategoria(libro.categoriaId) }}</p>
        <p><strong>Estado:</strong> {{ libro.estado | estadoLibro }}</p>
        <p><strong>Creado por:</strong> {{ libro.creadoPorUid }}</p>
        <p><strong>Creado:</strong> {{ libro.createdAt | date:'short' }}</p>
        <p><strong>Actualizado:</strong> {{ libro.updatedAt | date:'short' }}</p>
      </div>
    </section>
  `
})
export class DetalleComponent {
  libro?: Libro;
  categorias: Categoria[] = [];
  cargando = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private fs: FirestoreService
  ) {
    // cargar categorías
    this.fs.listarCategorias().subscribe(cs => this.categorias = cs);

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID no válido.';
      this.cargando = false;
      return;
    }

    this.fs.obtenerLibro(id).subscribe({
      next: (lib) => {
        if (!lib) {
          this.error = 'Libro no encontrado.';
        } else {
          this.libro = lib;
        }
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar el libro.';
        this.cargando = false;
      }
    });
  }

  getNombreCategoria(id?: string): string {
    const cat = this.categorias.find(c => c.id === id);
    return cat ? cat.nombre : '-';
  }
}
