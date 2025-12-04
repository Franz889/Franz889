import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css'],
  animations: [
    // Animación para la página completa (fondo)
    trigger('pageFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),

    // Animación para la tarjeta del login
    trigger('cardAnim', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-10px) scale(0.97)'
        }),
        animate(
          '280ms 80ms ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0) scale(1)'
          })
        )
      ])
    ])
  ]
})
export class AuthComponent {
  modo: 'login' | 'register' = 'login';
  form: FormGroup;
  cargando = false;
  mensajeOk = '';
  mensajeError = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''], // se usa sólo en registro
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  cambiarModo(m: 'login' | 'register') {
    this.modo = m;
    this.mensajeOk = '';
    this.mensajeError = '';
    this.form.reset();
  }

  async onSubmit() {
    this.mensajeOk = '';
    this.mensajeError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.email?.value;
    const password = this.password?.value;
    const confirm = this.confirmPassword?.value;

    // Validar coincidencia de contraseñas en registro
    if (this.modo === 'register' && password !== confirm) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;
    try {
      if (this.modo === 'login') {
        await this.auth.login(email, password);
        this.mensajeOk = 'Sesión iniciada correctamente.';
      } else {
        await this.auth.register(email, password);
        this.mensajeOk = 'Cuenta creada e iniciada sesión.';
      }

      this.form.reset();
      this.router.navigate(['/libros']);
    } catch (err: any) {
      console.error(err);
      this.mensajeError = err?.message || 'Error en autenticación.';
    } finally {
      this.cargando = false;
    }
  }
}
