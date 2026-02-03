import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GastoService, Presupuesto } from '../../services/gasto.service';

@Component({
  selector: 'app-presupuestos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './presupuestos.component.html',
  styleUrls: ['./presupuestos.component.css']
})
export class PresupuestosComponent implements OnInit {
  presupuestos: Presupuesto[] = [];
  usuario: any = null;
  loading = false;
  errorCarga = '';
  
  // Formulario nuevo presupuesto
  mostrarFormulario = false;
  editandoId: number | null = null; // ID del presupuesto en edición
  nuevoPresupuesto: Partial<Presupuesto> = {
    nombre: '',
    monto_total: 0,
    moneda: 'PEN',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: undefined
  };
  
  errorForm = '';
  loadingForm = false;

  constructor(
    private gastoService: GastoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarUsuario();
    this.cargarPresupuestos();
  }

  cargarUsuario() {
    this.authService.currentUser$.subscribe(user => {
      this.usuario = user;
    });
  }

  cargarPresupuestos() {
    this.loading = true;
    this.errorCarga = '';
    this.gastoService.getPresupuestos().subscribe({
      next: (presupuestos) => {
        this.presupuestos = presupuestos;
        this.loading = false;
        this.errorCarga = '';
        
        // Si no hay presupuestos, mostrar formulario automáticamente
        if (this.presupuestos.length === 0) {
          this.mostrarFormulario = true;
        }
      },
      error: (err: any) => {
        console.error('Error cargando presupuestos:', err);
        this.loading = false;
        
        // Mostrar formulario incluso si hay error
        // Probablemente el usuario es nuevo sin presupuestos
        this.presupuestos = [];
        this.mostrarFormulario = true;
        
        // Mostrar mensaje de error según el tipo
        if (err.status === 500) {
          this.errorCarga = 'Error en el servidor. Pero puedes crear un presupuesto.';
        } else if (err.status === 401 || err.status === 403) {
          this.errorCarga = 'No autorizado. Por favor inicia sesión de nuevo.';
        } else if (err.status === 0) {
          this.errorCarga = 'No se puede conectar al servidor.';
        } else {
          this.errorCarga = 'Error al cargar presupuestos.';
        }
      }
    });
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.editandoId = null;
    if (this.mostrarFormulario) {
      this.nuevoPresupuesto = {
        nombre: '',
        monto_total: 0,
        moneda: 'PEN',
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: undefined
      };
      this.errorForm = '';
    }
  }

  crearPresupuesto() {
    if (!this.nuevoPresupuesto.nombre || !this.nuevoPresupuesto.monto_total) {
      this.errorForm = 'Por favor completa los campos obligatorios';
      return;
    }

    if (this.nuevoPresupuesto.monto_total <= 0) {
      this.errorForm = 'El monto debe ser mayor a 0';
      return;
    }

    this.loadingForm = true;
    this.errorForm = '';

    // Si está editando, usar actualizarPresupuesto
    if (this.editandoId) {
      this.gastoService.actualizarPresupuesto(this.editandoId, this.nuevoPresupuesto).subscribe({
        next: (presupuestoActualizado) => {
          const indice = this.presupuestos.findIndex(p => p.id === this.editandoId);
          if (indice !== -1) {
            this.presupuestos[indice] = presupuestoActualizado;
          }
          this.loadingForm = false;
          this.mostrarFormulario = false;
          this.editandoId = null;
          this.errorForm = '';
        },
        error: (err) => {
          this.loadingForm = false;
          this.errorForm = 'Error al actualizar presupuesto. Intenta de nuevo.';
          console.error(err);
        }
      });
    } else {
      // Si es nuevo, crear presupuesto
      this.gastoService.crearPresupuesto(this.nuevoPresupuesto).subscribe({
        next: (presupuesto) => {
          this.presupuestos.push(presupuesto);
          this.loadingForm = false;
          this.mostrarFormulario = false;
          this.errorForm = '';
        },
        error: (err) => {
          this.loadingForm = false;
          this.errorForm = 'Error al crear presupuesto. Intenta de nuevo.';
          console.error(err);
        }
      });
    }
  }

  verPresupuesto(presupuesto: Presupuesto) {
    this.router.navigate(['/presupuesto', presupuesto.id]);
  }

  editarPresupuesto(presupuesto: Presupuesto, event: Event) {
    event.stopPropagation();
    this.editandoId = presupuesto.id!;
    this.nuevoPresupuesto = {
      nombre: presupuesto.nombre,
      monto_total: presupuesto.monto_total,
      moneda: presupuesto.moneda,
      fecha_inicio: presupuesto.fecha_inicio ? presupuesto.fecha_inicio.split('T')[0] : undefined,
      fecha_fin: presupuesto.fecha_fin ? presupuesto.fecha_fin.split('T')[0] : undefined
    };
    this.mostrarFormulario = true;
    this.errorForm = '';
  }

  eliminarPresupuesto(presupuesto: Presupuesto, event: Event) {
    event.stopPropagation();
    
    if (confirm(`¿Estás seguro de que deseas eliminar el presupuesto "${presupuesto.nombre}"?`)) {
      this.gastoService.eliminarPresupuesto(presupuesto.id!).subscribe({
        next: () => {
          this.presupuestos = this.presupuestos.filter(p => p.id !== presupuesto.id);
        },
        error: (err) => {
          console.error('Error al eliminar presupuesto:', err);
          alert('Error al eliminar presupuesto');
        }
      });
    }
  }

  calcularEstado(presupuesto: Presupuesto): string {
    const porcentaje = presupuesto.porcentaje_utilizado || 0;
    if (porcentaje >= 100) return 'excedido';
    if (porcentaje >= 80) return 'alto';
    return 'normal';
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
