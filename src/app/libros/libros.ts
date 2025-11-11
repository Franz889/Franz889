import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../core/firestore';
import { Categoria, Libro } from '../core/models';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './libros.html',
})
export class LibrosComponent {
  categorias: Categoria[] = [];
  libros: Libro[] = [];
  form: Partial<Libro> = { titulo: '', autor: '', anio: undefined, categoriaId: '' };

  // 🔍 NUEVO: filtros
  search = '';
  filterCategoriaId = '';

  constructor(private fs: FirestoreService) {
    // Cargar categorías para el selector
    this.fs.listarCategorias().subscribe(cs => this.categorias = cs);
    // Cargar libros
    this.fs.listarLibros().subscribe(ls => this.libros = ls);
  }

  // 🔎 NUEVO: lista filtrada
  get librosFiltrados(): Libro[] {
    const s = this.search.trim().toLowerCase();
    const cat = this.filterCategoriaId;

    return this.libros.filter(l => {
      const coincideTexto =
        !s ||
        (l.titulo ?? '').toLowerCase().includes(s) ||
        (l.autor ?? '').toLowerCase().includes(s);

      const coincideCategoria = !cat || (l.categoriaId === cat);

      return coincideTexto && coincideCategoria;
    });
  }

  async crear() {
    const t = (this.form.titulo ?? '').trim();
    if (!t || !this.form.categoriaId) return;
    await this.fs.crearLibro({
      titulo: t,
      autor: this.form.autor ?? '',
      anio: Number(this.form.anio) || undefined,
      categoriaId: this.form.categoriaId!,
      estado: 'disponible',
      creadoPorUid: 'anon',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    this.form = { titulo: '', autor: '', anio: undefined, categoriaId: '' };
  }

  async guardar(l: Libro) {
    if (!l.id) return;
    await this.fs.actualizarLibro(l.id, {
      titulo: l.titulo?.trim() ?? '',
      autor: l.autor ?? '',
      anio: l.anio ?? undefined,
      categoriaId: l.categoriaId ?? '',
      updatedAt: Date.now(),
    });
  }

  async borrar(id?: string) {
    if (!id) return;
    await this.fs.eliminarLibro(id);
  }

  // 🔢 Optimización del *ngFor
  trackById = (_: number, l: Libro) => l.id!;
}
