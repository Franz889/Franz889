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

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
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
      this.router.navigate(['/libros']); // puedes cambiar a otra ruta si quieres
    } catch (err: any) {
      console.error(err);
      this.mensajeError = err?.message || 'Error en autenticación.';
    } finally {
      this.cargando = false;
    }
  }
}
