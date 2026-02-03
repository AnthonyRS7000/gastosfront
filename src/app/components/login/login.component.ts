import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/presupuestos']);
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error completo:', err);
        
        // Mostrar error específico del backend
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
            this.error = 'Email o contraseña incorrectos';
          }
        } else if (err.status === 0) {
          this.error = 'No se puede conectar al servidor. Verifica que esté corriendo.';
        } else {
          this.error = err.error?.message || 'Error al iniciar sesión';
        }
      }
    });
  }
}
