Biblioteca Virtual
Aplicación web desarrollada por el estudiante Fran Marcel Rivera Quintana, con Angular Standalone y Firebase (Firestore + Authentication + Hosting) para gestionar una biblioteca digital.
Permite a los usuarios autenticarse, registrar libros, organizarlos por categorías, filtrarlos en tiempo real y visualizar estadísticas.
Tecnologías utilizadas
> Angular 17 (Standalone Components)
> Ty
> Firebase Authentication
> Firebase Firestore
> Firebase Hosting
> RxJS
> HTML / CSS
> Angular Animations (opcional)
Funcionalidades principales:

Autenticación:
> Registro de usuario.
> Inicio y cierre de sesión.
> Protección de rutas con guard.
> Acceso restringido solo para usuarios autenticados.

Gestión de Categorías (CRUD completo):
> Crear categorías.
> Editar categorías.
> Eliminar categorías.
> Búsqueda en tiempo real.
> Validaciones reactivas.

Gestión de Libros (CRUD completo):
> Agregar, editar y eliminar libros.
> Cada libro pertenece a una categoría.
> Cada libro se guarda bajo el usuario autenticado (multicuenta funcional).
> Filtro por título, autor o categoría.
> Campo de estado del libro (Disponible / Prestado).
> Detalle individual de cada libro.
> Validaciones de formularios reactivos:

Estadísticas en tiempo real:
> Total de libros
> Total de categorías
> Conteo de libros por categoría
> Datos actualizados desde Firestore sin recargar la página

Hosting en Firebase:
>Aplicación desplegada en producción en Firebase Hosting.
URL del proyecto desplegado:
https://biblioteca-virtual-8fd1b.web.app

Estructura principal del proyecto: 
src/
 ├── app/
 │   ├── auth/                # Login / Registro
 │   ├── libros/              # CRUD de libros
 │   ├── categorias/          # CRUD de categorías
 │   ├── estadisticas/        # Vista de estadísticas
 │   ├── core/
 │   │    ├── firestore.ts    # Servicios Firestore
 │   │    ├── auth.ts         # Autenticación Firebase
 │   │    └── models.ts       # Interfaces
 │   └── app.routes.ts        # Rutas + Guards
 ├── assets/
 └── environments/

Instalación y ejecución:
1️. Clonar el repositorio
git clone https://github.com/Franz889/Franz889.git
cd Franz889

2. Instalar dependencias
npm install

3️. Ejecutar en modo desarrollo
ng serve

4. Abrir en el navegador:
http://localhost:4200/ (O el puerto que te aparece)

5. Compilar para producción
ng build

Configuración Firebase
El proyecto utiliza:
> Authentication (Email/Password)
>Firestore Database
>Hosting

Para configurar Firebase:
firebase init
firebase deploy

URL de video (11 minutos)
https://drive.google.com/drive/folders/16ANKBTmUyqlCPZ2ALMwtzKL5WyPxW-Qz?usp=sharing

Autor:
Fran Marcel Rivera Quintana - Estudiante de ingeniería de sistemas de la Universidad Nacional José María Arguedas
Proyecto académico para el curso de Programación Web.

