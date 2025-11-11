import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Categoria, Libro } from './models';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  
  //CATEGORÍAS
 
  listarCategorias(): Observable<Categoria[]> {
    const categoriasRef = collection(this.firestore, 'categorias');
    return collectionData(categoriasRef, { idField: 'id' }) as Observable<Categoria[]>;
  }

  crearCategoria(categoria: Omit<Categoria, 'id'>) {
    const categoriasRef = collection(this.firestore, 'categorias');
    return addDoc(categoriasRef, categoria);
  }

  actualizarCategoria(id: string, data: Partial<Categoria>) {
    const ref = doc(this.firestore, `categorias/${id}`);
    return updateDoc(ref, data);
  }

  eliminarCategoria(id: string) {
    const ref = doc(this.firestore, `categorias/${id}`);
    return deleteDoc(ref);
  }

 
  // LIBROS
  
  listarLibros(): Observable<Libro[]> {
    const librosRef = collection(this.firestore, 'libros');
    return collectionData(librosRef, { idField: 'id' }) as Observable<Libro[]>;
  }

  crearLibro(libro: Omit<Libro, 'id'>) {
    const librosRef = collection(this.firestore, 'libros');
    return addDoc(librosRef, libro);
  }

  actualizarLibro(id: string, data: Partial<Libro>) {
    const ref = doc(this.firestore, `libros/${id}`);
    return updateDoc(ref, data);
  }

  eliminarLibro(id: string) {
    const ref = doc(this.firestore, `libros/${id}`);
    return deleteDoc(ref);
  }
}
