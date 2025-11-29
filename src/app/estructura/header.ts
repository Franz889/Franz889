import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/auth';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <header class="top-header">

      <!-- Versión cuando HAY usuario -->
      <div class="header-inner" *ngIf="user$ | async as user; else invitado">

        <div class="brand">
          <span class="brand-icon">📚</span>
          <span class="brand-text">Biblioteca Virtual</span>
        </div>

        <nav class="nav-links">
          <a routerLink="/" class="nav-link">Inicio</a>
          <a routerLink="/categorias" class="nav-link">Categorías</a>
          <a routerLink="/libros" class="nav-link">Libros</a>
          <a routerLink="/estadisticas" class="nav-link">Estadísticas</a>
        </nav>

        <div class="user-area">
          <span class="user-text">
            Hola, <strong>{{ user?.email }}</strong>
          </span>
          <button type="button" class="btn-logout" (click)="logout()">
            Cerrar sesión
          </button>
        </div>
      </div>

      <!-- Versión cuando NO hay usuario -->
      <ng-template #invitado>
        <div class="header-inner">
          <div class="brand">
            <span class="brand-icon">📚</span>
            <span class="brand-text">Biblioteca Virtual</span>
          </div>

          

          <div class="user-area">
            <button type="button" class="btn-login" (click)="irLogin()">
              Iniciar sesión
            </button>
          </div>
        </div>
      </ng-template>

    </header>
  `,
  styles: [`
    .top-header {
      background: #ffffff;
      border-bottom: 2px solid #c62828;
      box-shadow: 0 2px 4px rgba(0,0,0,0.08);
      padding: 6px 16px;
      font-size: 14px;
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .brand-icon {
      font-size: 18px;
    }

    .brand-text {
      font-weight: bold;
      color: #b71c1c;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      justify-content: center;
    }

    .nav-link {
      text-decoration: none;
      color: #424242;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 13px;
    }

    .nav-link:hover {
      background: #ffeaea;
      color: #c62828;
    }

    .user-area {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 190px;
      justify-content: flex-end;
    }

    .user-text {
      font-size: 12px;
      color: #555;
      text-align: right;
      max-width: 180px;
    }

    .btn-logout {
      padding: 4px 10px;
      border-radius: 16px;
      border: none;
      background: #c62828;
      color: white;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-login {
      padding: 4px 12px;
      border-radius: 16px;
      border: 1px solid #c62828;
      background: white;
      color: #c62828;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
  `]
})
export class HeaderComponent {
  user$!: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  irLogin() {
    this.router.navigate(['/login']);
  }
}
