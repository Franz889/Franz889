export interface Categoria {
  id?: string;
  nombre: string;
  descripcion?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface Libro {
  id?: string;
  titulo: string;
  autor: string;
  anio?: number;
  categoriaId: string;
  estado: 'disponible'|'prestado';
  creadoPorUid: string;
  createdAt?: number;
  updatedAt?: number;
}
