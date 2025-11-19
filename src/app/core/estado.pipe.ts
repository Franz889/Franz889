import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoLibro',
  standalone: true,            
})
export class EstadoLibroPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return 'Desconocido';

    const v = value.toLowerCase();

    if (v === 'disponible') return 'Disponible 📗';
    if (v === 'prestado')   return 'Prestado 📕';

    // por si en el futuro hay otros estados
    return value;
  }
}
