import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FirestoreService } from '../core/firestore';
import { Categoria, Libro } from '../core/models';
import { EstadoLibroPipe } from '../core/estado.pipe';
import { AuthService } from '../core/auth';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    EstadoLibroPipe
  ],
  templateUrl: './libros.html',
})
export class LibrosComponent {
  categorias: Categoria[] = [];
  libros: Libro[] = [];

  // indicador de carga
  cargando = true;

  // uid del usuario actual (null si no hay sesión todavía)
  currentUid: string | null = null;

  // filtros
  search = '';
  filterCategoriaId = '';

  // formulario reactivo
  formLibro!: FormGroup;

  mensajeOk = '';
  mensajeError = '';

  constructor(
    private fs: FirestoreService,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    // inicializar formulario
    this.formLibro = this.fb.group({
      id: [''], // para edición
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      autor: ['', [Validators.required, Validators.minLength(3)]],
      anio: [null, [
        Validators.required,
        Validators.min(1900),
        Validators.max(new Date().getFullYear())
      ]],
      categoriaId: ['', Validators.required],
    });

    // escuchar cambios de usuario logueado
    this.auth.user$.subscribe(user => {
      this.currentUid = user?.uid ?? null;
    });

    // cargar categorías
    this.fs.listarCategorias().subscribe(cs => this.categorias = cs);

    // cargar libros
    this.fs.listarLibros().subscribe(ls => {
      this.libros = ls;
      this.cargando = false;
    });
  }

  // Getters para el HTML
  get titulo() { return this.formLibro.get('titulo'); }
  get autor() { return this.formLibro.get('autor'); }
  get anio() { return this.formLibro.get('anio'); }
  get categoriaId() { return this.formLibro.get('categoriaId'); }
  get editando() { return !!this.formLibro.get('id')?.value; }

  // lista filtrada + ordenada + solo libros del usuario actual
  get librosFiltrados(): Libro[] {
    const s = this.search.trim().toLowerCase();
    const cat = this.filterCategoriaId;
    const uid = this.currentUid;

    return this.libros
      .filter(l => {
        // si hay usuario logueado, solo ver sus libros
        if (uid && l.creadoPorUid !== uid) return false;

        const coincideTexto =
          !s ||
          (l.titulo ?? '').toLowerCase().includes(s) ||
          (l.autor ?? '').toLowerCase().includes(s);

        const coincideCategoria = !cat || (l.categoriaId === cat);

        return coincideTexto && coincideCategoria;
      })
      .sort((a, b) => (a.titulo ?? '').localeCompare(b.titulo ?? ''));
  }

  // helper para obtener nombre de categoría
  getNombreCategoria(categoriaId?: string): string {
    const cat = this.categorias.find(c => c.id === categoriaId);
    return cat ? cat.nombre : '-';
  }

  // Crear / Actualizar libro
  async guardar() {
    this.mensajeOk = '';
    this.mensajeError = '';

    if (this.formLibro.invalid) {
      this.formLibro.markAllAsTouched();
      return;
    }

    const { id, titulo, autor, anio, categoriaId } = this.formLibro.value;
    const uid = this.currentUid ?? 'anon';

    try {
      if (id) {
        // actualizar
        await this.fs.actualizarLibro(id, {
          titulo: (titulo ?? '').trim(),
          autor: autor ?? '',
          anio: anio ?? undefined,
          categoriaId: categoriaId ?? '',
          updatedAt: Date.now(),
        });
        this.mensajeOk = 'Libro actualizado correctamente.';
      } else {
        // crear
        await this.fs.crearLibro({
          titulo: (titulo ?? '').trim(),
          autor: autor ?? '',
          anio: anio ?? undefined,
          categoriaId: categoriaId ?? '',
          estado: 'disponible',
          creadoPorUid: uid,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        this.mensajeOk = 'Libro creado correctamente.';
      }

      this.formLibro.reset();
    } catch (err) {
      console.error(err);
      this.mensajeError = 'Ocurrió un error al guardar el libro.';
    }
  }

  // Cambiar estado disponible / prestado
  async cambiarEstado(libro: Libro, nuevoEstado: 'disponible' | 'prestado') {
    if (!libro.id) return;

    this.mensajeOk = '';
    this.mensajeError = '';

    try {
      await this.fs.actualizarLibro(libro.id, {
        estado: nuevoEstado,
        updatedAt: Date.now(),
      });

      this.mensajeOk =
        nuevoEstado === 'disponible'
          ? 'Libro marcado como disponible.'
          : 'Libro marcado como prestado.';
    } catch (err) {
      console.error(err);
      this.mensajeError = 'No se pudo cambiar el estado del libro.';
    }
  }

  // Cargar datos para editar
  editar(libro: Libro) {
    this.mensajeOk = '';
    this.mensajeError = '';

    this.formLibro.reset({
      id: libro.id ?? '',
      titulo: libro.titulo ?? '',
      autor: libro.autor ?? '',
      anio: (libro.anio ?? null) as any,
      categoriaId: libro.categoriaId ?? '',
    });
  }

  cancelarEdicion() {
    this.formLibro.reset();
  }

  // Eliminar
  async borrar(id?: string) {
    if (!id) return;
    const ok = confirm('¿Seguro que quieres eliminar este libro?');
    if (!ok) return;

    this.mensajeOk = '';
    this.mensajeError = '';

    try {
      await this.fs.eliminarLibro(id);
      this.mensajeOk = 'Libro eliminado correctamente.';
    } catch (err) {
      console.error(err);
      this.mensajeError = 'No se pudo eliminar el libro.';
    }
  }

  trackById = (_: number, l: Libro) => l.id!;
}
