import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GastoService, Gasto, Presupuesto, Tipo, EstadisticasPresupuesto } from '../../services/gasto.service';

@Component({
  selector: 'app-presupuesto-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './presupuesto-detalle.component.html',
  styleUrls: ['./presupuesto-detalle.component.css']
})
export class PresupuestoDetalleComponent implements OnInit {
  presupuesto: Presupuesto | null = null;
  estadisticas: EstadisticasPresupuesto | null = null;
  usuario: any = null;
  loading = true;
  loadingForm = false;
  
  // Gastos
  gastos: Gasto[] = [];
  gastosFiltrados: Gasto[] = [];
  tipos: Tipo[] = [];
  
  // Filtros
  filtroTipo: number | string = 'todos';
  filtroFechaDesde: string = '';
  filtroFechaHasta: string = '';
  filtroPagado: string = 'todos';
  ordenar: string = 'fecha-desc';
  
  // Formulario nuevo gasto
  mostrarFormulario = false;
  editandoGastoId: number | null = null;
  nuevoGasto: Partial<Gasto> = {
    monto: 0,
    moneda: 'PEN',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    lugar: '',
    pagado: true,
    tipo_id: undefined
  };
  
  nuevoTipoNombre = '';
  mostrarOtroTipo = false;
  errorForm = '';

  constructor(
    private gastoService: GastoService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cargarUsuario();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarPresupuesto(Number(id));
      this.cargarTipos();
    }
  }

  cargarUsuario() {
    this.authService.currentUser$.subscribe(user => {
      this.usuario = user;
    });
  }

  cargarPresupuesto(id: number) {
    this.loading = true;
    
    // Cargar presupuesto
    this.gastoService.getPresupuesto(id).subscribe({
      next: (presupuesto) => {
        this.presupuesto = presupuesto;
        this.gastos = presupuesto.gastos || [];
        this.nuevoGasto.presupuesto_id = id;
        this.nuevoGasto.moneda = presupuesto.moneda;
        this.aplicarFiltros();
      },
      error: (err) => {
        console.error('Error cargando presupuesto:', err);
        this.loading = false;
      }
    });

    // Cargar estadísticas
    this.gastoService.getEstadisticasPresupuesto(id).subscribe({
      next: (estadisticas) => {
        this.estadisticas = estadisticas;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando estadísticas:', err);
        this.loading = false;
      }
    });
  }

  cargarTipos() {
    this.gastoService.getTipos().subscribe({
      next: (tipos) => {
        this.tipos = tipos;
      },
      error: (err) => console.error('Error cargando tipos:', err)
    });
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (this.mostrarFormulario) {
      this.nuevoGasto = {
        monto: 0,
        moneda: this.presupuesto?.moneda || 'PEN',
        fecha: new Date().toISOString().split('T')[0],
        descripcion: '',
        lugar: '',
        pagado: true,
        tipo_id: undefined,
        presupuesto_id: this.presupuesto?.id
      };
      this.errorForm = '';
      this.mostrarOtroTipo = false;
      this.nuevoTipoNombre = '';
    }
  }

  crearGasto() {
    // Si estamos editando, llamar a actualizar
    if (this.editandoGastoId) {
      this.actualizarGasto();
      return;
    }

    if (!this.nuevoGasto.monto || !this.nuevoGasto.fecha) {
      this.errorForm = 'Por favor completa los campos obligatorios';
      return;
    }

    if (this.nuevoGasto.monto <= 0) {
      this.errorForm = 'El monto debe ser mayor a 0';
      return;
    }

    if (!this.nuevoGasto.tipo_id && !this.nuevoTipoNombre) {
      this.errorForm = 'Debes seleccionar o crear un tipo';
      return;
    }

    this.loadingForm = true;
    this.errorForm = '';

    const gastoParaEnviar: any = { ...this.nuevoGasto };
    if (this.nuevoTipoNombre) {
      gastoParaEnviar.tipo_nombre = this.nuevoTipoNombre;
      delete gastoParaEnviar.tipo_id;
    }

    this.gastoService.crearGasto(gastoParaEnviar).subscribe({
      next: (gasto) => {
        this.gastos.push(gasto);
        this.aplicarFiltros();
        this.loadingForm = false;
        this.mostrarFormulario = false;
        this.errorForm = '';
        
        // Recargar presupuesto para actualizar montos
        if (this.presupuesto?.id) {
          this.cargarPresupuesto(this.presupuesto.id);
        }
      },
      error: (err) => {
        this.loadingForm = false;
        if (err.error?.message) {
          this.errorForm = err.error.message;
        } else {
          this.errorForm = 'Error al crear gasto. Intenta de nuevo.';
        }
        console.error(err);
      }
    });
  }

  actualizarGasto() {
    if (!this.editandoGastoId) return;

    if (!this.nuevoGasto.monto || !this.nuevoGasto.fecha) {
      this.errorForm = 'Por favor completa los campos obligatorios';
      return;
    }

    if (this.nuevoGasto.monto <= 0) {
      this.errorForm = 'El monto debe ser mayor a 0';
      return;
    }

    this.loadingForm = true;
    this.errorForm = '';

    this.gastoService.actualizarGasto(this.editandoGastoId, this.nuevoGasto).subscribe({
      next: (gastoActualizado) => {
        // Actualizar en la lista local
        const indice = this.gastos.findIndex(g => g.id === this.editandoGastoId);
        if (indice !== -1) {
          this.gastos[indice] = gastoActualizado;
        }
        
        this.aplicarFiltros();
        this.loadingForm = false;
        this.mostrarFormulario = false;
        this.editandoGastoId = null;
        this.errorForm = '';
        
        // Recargar presupuesto para actualizar montos
        if (this.presupuesto?.id) {
          this.cargarPresupuesto(this.presupuesto.id);
        }
      },
      error: (err) => {
        this.loadingForm = false;
        if (err.error?.message) {
          this.errorForm = err.error.message;
        } else {
          this.errorForm = 'Error al actualizar gasto. Intenta de nuevo.';
        }
        console.error(err);
      }
    });
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.editandoGastoId = null;
    this.resetearFormulario();
  }

  abrirFormulario() {
    this.editandoGastoId = null;
    this.mostrarFormulario = true;
    this.resetearFormulario();
  }

  resetearFormulario() {
    this.nuevoGasto = {
      monto: 0,
      moneda: this.presupuesto?.moneda || 'PEN',
      fecha: new Date().toISOString().split('T')[0],
      descripcion: '',
      lugar: '',
      pagado: true,
      tipo_id: undefined,
      presupuesto_id: this.presupuesto?.id
    };
    this.nuevoTipoNombre = '';
    this.mostrarOtroTipo = false;
    this.errorForm = '';
  }

  onTipoChange() {
    const tipoId = this.nuevoGasto.tipo_id;
    this.mostrarOtroTipo = String(tipoId) === '-1';
    if (!this.mostrarOtroTipo) {
      this.nuevoTipoNombre = '';
    }
  }

  editarGasto(gasto: Gasto) {
    this.editandoGastoId = gasto.id || null;
    this.nuevoGasto = {
      monto: gasto.monto,
      moneda: gasto.moneda,
      fecha: gasto.fecha.split('T')[0],
      descripcion: gasto.descripcion,
      lugar: gasto.lugar,
      pagado: gasto.pagado,
      tipo_id: gasto.tipo_id,
      presupuesto_id: gasto.presupuesto_id
    };
    this.mostrarFormulario = true;
  }

  eliminarGasto(gasto: Gasto, event: Event) {
    event.stopPropagation();
    
    if (confirm(`¿Estás seguro de que deseas eliminar este gasto?`)) {
      this.gastoService.eliminarGasto(gasto.id!).subscribe({
        next: () => {
          this.gastos = this.gastos.filter(g => g.id !== gasto.id);
          this.aplicarFiltros();
          
          // Recargar presupuesto
          if (this.presupuesto?.id) {
            this.cargarPresupuesto(this.presupuesto.id);
          }
        },
        error: (err) => {
          console.error('Error al eliminar gasto:', err);
          alert('Error al eliminar gasto');
        }
      });
    }
  }

  aplicarFiltros() {
    let resultado = [...this.gastos];

    // Filtro por tipo
    if (this.filtroTipo !== 'todos') {
      resultado = resultado.filter(g => g.tipo_id === Number(this.filtroTipo));
    }

    // Filtro por fecha desde
    if (this.filtroFechaDesde) {
      resultado = resultado.filter(g => new Date(g.fecha) >= new Date(this.filtroFechaDesde));
    }

    // Filtro por fecha hasta
    if (this.filtroFechaHasta) {
      resultado = resultado.filter(g => new Date(g.fecha) <= new Date(this.filtroFechaHasta));
    }

    // Filtro por pagado
    if (this.filtroPagado !== 'todos') {
      const pagado = this.filtroPagado === 'pagado';
      resultado = resultado.filter(g => g.pagado === pagado);
    }

    // Ordenar
    if (this.ordenar === 'fecha-desc') {
      resultado.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    } else if (this.ordenar === 'fecha-asc') {
      resultado.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    } else if (this.ordenar === 'monto-desc') {
      resultado.sort((a, b) => (b.monto || 0) - (a.monto || 0));
    } else if (this.ordenar === 'monto-asc') {
      resultado.sort((a, b) => (a.monto || 0) - (b.monto || 0));
    }

    this.gastosFiltrados = resultado;
  }

  onFiltroChange() {
    this.aplicarFiltros();
  }

  hayFiltrosActivos(): boolean {
    return Boolean(this.filtroTipo !== 'todos' ||
           this.filtroFechaDesde ||
           this.filtroFechaHasta ||
           this.filtroPagado !== 'todos' ||
           this.ordenar !== 'fecha-desc');
  }

  limpiarFiltros() {
    this.filtroTipo = 'todos';
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    this.filtroPagado = 'todos';
    this.ordenar = 'fecha-desc';
    this.aplicarFiltros();
  }

  calcularTotal(): number {
    return this.gastosFiltrados.reduce((sum, g) => sum + (g.monto || 0), 0);
  }

  obtenerNombreTipo(tipo_id?: number): string {
    if (!tipo_id) return '';
    const tipo = this.tipos.find(t => t.id === tipo_id);
    return tipo ? tipo.nombre : 'Desconocido';
  }

  volver() {
    this.router.navigate(['/presupuestos']);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
