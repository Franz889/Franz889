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
    <section style="padding:24px 16px; max-width:900px; margin:auto;">

      <!-- Título -->
      <header style="margin-bottom:12px;">
        <h2 style="font-size:24px; margin:0 0 4px; display:flex; align-items:center; gap:8px;">
          <span style="font-size:22px;">📂</span>
          <span>Categorías</span>
        </h2>
        <p style="margin:0; font-size:13px; opacity:.8;">
          Crea y administra las categorías para organizar los libros de la biblioteca virtual.
        </p>
      </header>

      <!-- Mensajes -->
      <div *ngIf="mensajeOk"
           style="margin:8px 0; padding:8px 10px; border-radius:4px; background:#e8f5e9; border:1px solid #c8e6c9; font-size:13px;">
        ✅ {{ mensajeOk }}
      </div>
      <div *ngIf="mensajeError"
           style="margin:8px 0; padding:8px 10px; border-radius:4px; background:#ffebee; border:1px solid #ffcdd2; font-size:13px;">
        ⚠️ {{ mensajeError }}
      </div>

      <!-- Filtro de búsqueda -->
      <section style="
        display:flex;
        gap:8px;
        margin:14px 0;
        align-items:center;
        flex-wrap:wrap;
        padding:10px 12px;
        border-radius:6px;
        background:#fafafa;
        border:1px solid #e0e0e0;
      ">
        <input
          [(ngModel)]="search"
          name="search"
          placeholder="🔎 Buscar por nombre o descripción"
          style="flex:1 1 220px; min-width:180px; padding:6px 8px; border-radius:4px; border:1px solid #c4c4c4; font-size:13px;"
        />
        <button
          type="button"
          (click)="search='';"
          style="
            padding:6px 10px;
            border-radius:4px;
            border:1px solid #bdbdbd;
            background:white;
            cursor:pointer;
            font-size:13px;
          "
        >
          Limpiar filtro
        </button>
      </section>

      <!-- FORMULARIO REACTIVO -->
      <section style="
        margin:16px 0;
        padding:14px 16px;
        border-radius:6px;
        background:#fffde7;
        border:1px solid #ffe082;
      ">
        <h3 style="margin:0 0 10px; font-size:18px;">
          {{ editando ? 'Editar categoría' : 'Agregar categoría' }}
        </h3>

        <form
          [formGroup]="formCategoria"
          (ngSubmit)="guardar()"
          style="
            display:grid;
            grid-template-columns: 1.3fr 2fr auto;
            gap:8px 10px;
            align-items:flex-start;
          "
        >
          <input type="hidden" formControlName="id" />

          <!-- Nombre -->
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:12px; margin-bottom:2px;">Nombre *</label>
            <input
              formControlName="nombre"
              placeholder="Ej: Programación"
              style="padding:6px 8px; border-radius:4px; border:1px solid #c4c4c4; font-size:13px;"
            />
            <small
              *ngIf="nombre?.invalid && (nombre?.touched || nombre?.dirty)"
              style="color:#c62828; font-size:11px; margin-top:2px;"
            >
              <span *ngIf="nombre?.errors?.['required']">El nombre es obligatorio. </span>
              <span *ngIf="nombre?.errors?.['minlength']">Mínimo 3 caracteres.</span>
            </small>
          </div>

          <!-- Descripción -->
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:12px; margin-bottom:2px;">Descripción</label>
            <input
              formControlName="descripcion"
              placeholder="Ej: Libros relacionados a desarrollo de software"
              style="padding:6px 8px; border-radius:4px; border:1px solid #c4c4c4; font-size:13px;"
            />
          </div>

          <!-- Botones -->
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
            <button
              type="submit"
              [disabled]="formCategoria.invalid"
              style="
                padding:6px 12px;
                border-radius:4px;
                border:none;
                cursor:pointer;
                font-size:13px;
                background:#2e7d32;
                color:white;
              "
            >
              {{ editando ? 'Actualizar' : 'Agregar' }}
            </button>
            <button
              type="button"
              (click)="cancelarEdicion()"
              style="
                padding:4px 10px;
                border-radius:4px;
                border:1px solid #bdbdbd;
                background:white;
                cursor:pointer;
                font-size:12px;
              "
            >
              Limpiar
            </button>
          </div>
        </form>
      </section>

      <!-- Mensaje si no hay categorías -->
      <p *ngIf="categoriasFiltradas.length === 0"
         style="margin-top:8px; font-size:13px; opacity:.7;">
        No hay categorías que coincidan con el filtro actual.
      </p>

      <!-- LISTA DE CATEGORÍAS -->
      <section *ngIf="categoriasFiltradas.length > 0" style="margin-top:8px;">
        <ul style="list-style:none; padding:0; margin:0;">
          <li
            *ngFor="let c of categoriasFiltradas; trackBy: trackById"
            style="
              margin:6px 0;
              padding:8px 10px;
              border-radius:6px;
              border:1px solid #e0e0e0;
              background:#fafafa;
              display:flex;
              flex-direction:column;
              gap:4px;
            "
          >
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <div>
                <strong>{{ c.nombre }}</strong>
                <span *ngIf="c.descripcion"> – {{ c.descripcion }}</span>
              </div>
              <small style="opacity:.6; font-size:11px;">ID: {{ c.id }}</small>
            </div>

            <div style="margin-top:4px; display:flex; gap:6px;">
              <button
                type="button"
                (click)="editar(c)"
                style="
                  padding:3px 8px;
                  font-size:12px;
                  border-radius:4px;
                  border:1px solid #1976d2;
                  background:#e3f2fd;
                  cursor:pointer;
                "
              >
                Editar
              </button>
              <button
                type="button"
                (click)="borrar(c)"
                style="
                  padding:3px 8px;
                  font-size:12px;
                  border-radius:4px;
                  border:1px solid #d32f2f;
                  background:#ffebee;
                  cursor:pointer;
                "
              >
                Eliminar
              </button>
            </div>
          </li>
        </ul>
      </section>

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
