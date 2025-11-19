import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { FirestoreService } from '../core/firestore';
import { Categoria } from '../core/models';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <section style="padding:16px; max-width:720px; margin:auto">
      <h2>📂 Categorías</h2>

      <!-- Mensajes -->
      <div *ngIf="mensajeOk" style="margin:8px 0; padding:8px; border-radius:4px; background:#d1fae5;">
        {{ mensajeOk }}
      </div>
      <div *ngIf="mensajeError" style="margin:8px 0; padding:8px; border-radius:4px; background:#fee2e2;">
        {{ mensajeError }}
      </div>

      <!-- Filtro de búsqueda -->
      <div style="display:flex; gap:8px; margin:12px 0; flex-wrap:wrap">
        <input [(ngModel)]="search" name="search" placeholder="🔎 Buscar por nombre o descripción" />
        <button type="button" (click)="search=''">Limpiar filtro</button>
      </div>

      <!-- FORMULARIO REACTIVO -->
      <h3>{{ editando ? 'Editar categoría' : 'Agregar categoría' }}</h3>

      <form [formGroup]="formCategoria"
            (ngSubmit)="guardar()"
            style="display:flex; gap:8px; margin:12px 0; flex-wrap:wrap">
        <input type="hidden" formControlName="id" />

        <div style="display:flex; flex-direction:column; flex:1 1 180px;">
          <input formControlName="nombre" placeholder="Nombre" />
          <small *ngIf="nombre?.invalid && (nombre?.touched || nombre?.dirty)" style="color:#c62828; font-size:13px;">
            <span *ngIf="nombre?.errors?.['required']">El nombre es obligatorio.</span>
            <span *ngIf="nombre?.errors?.['minlength']">Mínimo 3 caracteres.</span>
          </small>
        </div>

        <div style="display:flex; flex-direction:column; flex:2 1 220px;">
          <input formControlName="descripcion" placeholder="Descripción" />
        </div>

        <div style="display:flex; gap:4px; align-items:center;">
          <button type="submit">
            {{ editando ? 'Actualizar' : 'Agregar' }}
          </button>
          <button type="button" (click)="cancelarEdicion()">Limpiar</button>
        </div>
      </form>

      <!-- Mensaje si no hay categorías -->
      <p *ngIf="categoriasFiltradas.length === 0">
        No hay categorías que coincidan.
      </p>

      <!-- LISTA DE CATEGORÍAS -->
      <ul>
        <li *ngFor="let c of categoriasFiltradas; trackBy: trackById" style="margin:6px 0">
          <strong>{{ c.nombre }}</strong>
          <span *ngIf="c.descripcion"> – {{ c.descripcion }}</span>
          <small style="opacity:.6"> • {{ c.id }}</small>
          <div style="margin-top:4px;">
            <button type="button" (click)="editar(c)">Editar</button>
            <button type="button" (click)="borrar(c)">Eliminar</button>
          </div>
        </li>
      </ul>
    </section>
  `,
})
export class CategoriasComponent {
  categorias: Categoria[] = [];
  search = '';

  formCategoria!: FormGroup;

  mensajeOk = '';
  mensajeError = '';

  constructor(
    private fs: FirestoreService,
    private fb: FormBuilder
  ) {
    // inicializamos el form REACTIVO
    this.formCategoria = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
    });

    // cargamos categorías
    this.fs.listarCategorias().subscribe({
      next: (data) => {
        // ordenamos por nombre (ordenamiento)
        this.categorias = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      },
      error: (e) => console.error('Firestore error:', e),
    });
  }

  get nombre() { return this.formCategoria.get('nombre'); }
  get descripcion() { return this.formCategoria.get('descripcion'); }
  get editando() { return !!this.formCategoria.get('id')?.value; }

  // lista filtrada según búsqueda
  get categoriasFiltradas(): Categoria[] {
    const s = this.search.trim().toLowerCase();
    if (!s) return this.categorias;
    return this.categorias.filter(c =>
      c.nombre.toLowerCase().includes(s) ||
      (c.descripcion ?? '').toLowerCase().includes(s)
    );
  }

  async guardar() {
    this.mensajeOk = '';
    this.mensajeError = '';

    if (this.formCategoria.invalid) {
      this.formCategoria.markAllAsTouched();
      return;
    }

    const { id, nombre, descripcion } = this.formCategoria.value;

    try {
      if (id) {
        // actualizar
        await this.fs.actualizarCategoria(id, {
          nombre: (nombre ?? '').trim(),
          descripcion: descripcion ?? '',
          updatedAt: Date.now(),
        });
        this.mensajeOk = 'Categoría actualizada correctamente.';
      } else {
        // crear
        await this.fs.crearCategoria({
          nombre: (nombre ?? '').trim(),
          descripcion: descripcion ?? '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        this.mensajeOk = 'Categoría creada correctamente.';
      }

      this.formCategoria.reset();
    } catch (err) {
      console.error(err);
      this.mensajeError = 'Ocurrió un error al guardar la categoría.';
    }
  }

  editar(c: Categoria) {
    this.mensajeOk = '';
    this.mensajeError = '';

    this.formCategoria.reset({
      id: c.id ?? '',
      nombre: c.nombre ?? '',
      descripcion: c.descripcion ?? '',
    });
  }

  cancelarEdicion() {
    this.formCategoria.reset();
  }

  async borrar(c: Categoria) {
    if (!c.id) return;
    const ok = confirm(`¿Seguro que quieres eliminar la categoría "${c.nombre}"?`);
    if (!ok) return;

    this.mensajeOk = '';
    this.mensajeError = '';

    try {
      await this.fs.eliminarCategoria(c.id);
      this.mensajeOk = 'Categoría eliminada correctamente.';
    } catch (err) {
      console.error(err);
      this.mensajeError = 'No se pudo eliminar la categoría.';
    }
  }

  trackById = (_: number, c: Categoria) => c.id!;
}
