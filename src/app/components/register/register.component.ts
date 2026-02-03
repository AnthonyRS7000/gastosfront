import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre = '';
  email = '';
  password = '';
  passwordConfirm = '';
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister() {
    if (!this.nombre || !this.email || !this.password || !this.passwordConfirm) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    if (this.password !== this.passwordConfirm) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.nombre, this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/presupuestos']);
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error registro:', err);
        
        if (err.status === 422) {
          const validationErrors = err.error?.errors || err.error?.message;
          if (validationErrors) {
            if (typeof validationErrors === 'object') {
              const errorValues = Object.values(validationErrors) as any[];
              this.error = errorValues[0]?.[0] || 'Datos inválidos';
            } else {
              this.error = validationErrors;
            }
          } else {
            this.error = 'Error al registrarse';
          }
        } else if (err.status === 0) {
          this.error = 'No se puede conectar al servidor';
        } else {
          this.error = err.error?.message || 'Error al registrarse';
        }
      }
    });
  }
}
