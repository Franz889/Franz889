import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../core/firestore';
import { Libro, Categoria } from '../../core/models';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.html',
  styleUrls: ['./estadisticas.css']
})
export class EstadisticasComponent implements OnInit {

  totalLibros = 0;
  totalCategorias = 0;
  librosPorCategoria: { categoria: string; cantidad: number }[] = [];
  cargando = true;

  constructor(private fs: FirestoreService) {}

  ngOnInit(): void {
    this.fs.listarCategorias().subscribe(categorias => {
      this.totalCategorias = categorias.length;

      this.fs.listarLibros().subscribe(libros => {
        this.totalLibros = libros.length;

        const conteo: Record<string, number> = {};

        libros.forEach(libro => {
          const idCat = libro.categoriaId || 'sin';
          conteo[idCat] = (conteo[idCat] || 0) + 1;
        });

        this.librosPorCategoria = Object.keys(conteo).map(idCat => {
          const categoria = categorias.find(c => c.id === idCat);
          return {
            categoria: categoria ? categoria.nombre : 'Sin categoría',
            cantidad: conteo[idCat],
          };
        });

        this.cargando = false;
      });
    });
  }
}
