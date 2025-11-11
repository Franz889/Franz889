import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../core/firestore';
import { Categoria } from '../core/models';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section style="padding:16px; max-width:720px; margin:auto">
      <h2>📂 Categorías</h2>

      <form (ngSubmit)="crear()" style="display:flex; gap:8px; margin:12px 0; flex-wrap:wrap">
        <input [(ngModel)]="form.nombre" name="nombre" placeholder="Nombre" required />
        <input [(ngModel)]="form.descripcion" name="descripcion" placeholder="Descripción" />
        <button type="submit" [disabled]="!(form.nombre?.trim())">Agregar</button>

      </form>
      <div *ngIf="!(form.nombre?.trim())" style="color:#c62828; font-size:13px;">
      ⚠️ El campo <strong>Nombre</strong> es obligatorio.
    </div>
      <p *ngIf="(categorias?.length ?? 0) === 0">No hay categorías.</p>

      <ul>
        <li *ngFor="let c of categorias" style="margin:6px 0">
          <input [(ngModel)]="c.nombre" name="n{{c.id}}" />
          <input [(ngModel)]="c.descripcion" name="d{{c.id}}" placeholder="Descripción" />
          <button type="button" (click)="guardar(c)">Guardar</button>
          <button type="button" (click)="borrar(c)">Eliminar</button>
          <small style="opacity:.6"> • {{c.id}}</small>
        </li>
      </ul>
    </section>
    
  `,
})
export class CategoriasComponent {
  categorias: Categoria[] = [];
  form: Partial<Categoria> = { nombre: '', descripcion: '' };

  constructor(private fs: FirestoreService) {
    this.fs.listarCategorias().subscribe({
      next: (data) => {
        console.log('categorias:', data);
        this.categorias = data;
      },
      error: (e) => console.error('Firestore error:', e),
    });
  }

  async crear() {
    const nombre = (this.form.nombre ?? '').trim();
    if (!nombre) return;
    await this.fs.crearCategoria({
      nombre,
      descripcion: this.form.descripcion ?? '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    this.form = { nombre: '', descripcion: '' };
  }

  async guardar(c: Categoria) {
    if (!c.id) return;
    await this.fs.actualizarCategoria(c.id, {
      nombre: c.nombre?.trim() ?? '',
      descripcion: c.descripcion ?? '',
      updatedAt: Date.now(),
    });
  }

  async borrar(c: Categoria) {
    if (!c.id) return;
    await this.fs.eliminarCategoria(c.id);
  }
trackById = (_: number, c: Categoria) => c.id!;

}
