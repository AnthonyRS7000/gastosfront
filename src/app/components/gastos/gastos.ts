import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GastoService, Gasto, Tipo, Presupuesto } from '../../services/gasto.service';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gastos.html',
  styleUrls: ['./gastos.css']
})
export class GastosComponent implements OnInit {
  gastos: Gasto[] = [];
  gastosFiltrados: Gasto[] = [];
  tipos: Tipo[] = [];
  presupuestos: Presupuesto[] = [];
  presupuestoSeleccionado: Presupuesto | null = null;
  usuario: any = null;
  
  // Filtros
  filtroTipo: number | string = 'todos';
  filtroFechaDesde: string = '';
  filtroFechaHasta: string = '';
  filtroPresupuesto: number | string = 'todos';
  
  // Carril de fechas
  diasCarril: { fecha: Date; dia: string; numero: number; mes: string; activo: boolean }[] = [];
  fechaSeleccionada: string | null = null;
  
  // Formulario gasto
  mostrarFormulario = false;
  nuevoGasto: Partial<Gasto> = {
    monto: 0,
    moneda: 'PEN',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    lugar: '',
    pagado: true,
    tipo_id: undefined,
    presupuesto_id: undefined
  };
  
  nuevoTipoNombre = '';
  mostrarOtroTipo = false;
  
  // Formulario presupuesto
  mostrarFormularioPresupuesto = false;
  nuevoPresupuesto: Partial<Presupuesto> = {
    nombre: '',
    monto_total: 0,
    moneda: 'PEN',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: undefined  // 👈 CORREGIDO: undefined en lugar de null
  };
  
  loading = false;
  mostrarDetallePresupuesto = false;

  constructor(
    private gastoService: GastoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarUsuario();
    this.cargarTipos();
    this.cargarPresupuestos();
    this.cargarGastos();
  }

  cargarUsuario() {
    this.authService.currentUser$.subscribe(user => {
      this.usuario = user;
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

  cargarPresupuestos() {
    this.gastoService.getPresupuestos().subscribe({
      next: (presupuestos) => {
        this.presupuestos = presupuestos;
      },
      error: (err) => console.error('Error cargando presupuestos:', err)
    });
  }

  cargarGastos() {
    this.loading = true;
    
    // Si hay presupuesto seleccionado, filtrar por él
    const filtro = this.presupuestoSeleccionado 
      ? { presupuesto_id: this.presupuestoSeleccionado.id } 
      : undefined;
    
    this.gastoService.getGastos(filtro).subscribe({
      next: (gastos) => {
        this.gastos = gastos;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando gastos:', err);
        this.loading = false;
      }
    });
  }

  seleccionarPresupuesto(presupuesto: Presupuesto | null) {
    this.presupuestoSeleccionado = presupuesto;
    
    // Actualizar el filtro de presupuesto
    if (presupuesto) {
      this.filtroPresupuesto = presupuesto.id!;
      this.nuevoGasto.presupuesto_id = presupuesto.id;
      this.mostrarDetallePresupuesto = true;
    } else {
      this.filtroPresupuesto = 'todos';
      this.nuevoGasto.presupuesto_id = undefined;
      this.mostrarDetallePresupuesto = false;
    }
    
    this.cargarGastos();
  }

  aplicarFiltros() {
    let resultado = [...this.gastos];

    // Filtro por tipo
    if (this.filtroTipo !== 'todos') {
      resultado = resultado.filter(g => g.tipo_id === Number(this.filtroTipo));
    }

    // Filtro por presupuesto
    if (this.filtroPresupuesto !== 'todos') {
      resultado = resultado.filter(g => g.presupuesto_id === Number(this.filtroPresupuesto));
    }

    // Filtro por fecha desde
    if (this.filtroFechaDesde) {
      resultado = resultado.filter(g => {
        const fechaGasto = g.fecha.split('T')[0];
        return fechaGasto >= this.filtroFechaDesde;
      });
    }

    // Filtro por fecha hasta
    if (this.filtroFechaHasta) {
      resultado = resultado.filter(g => {
        const fechaGasto = g.fecha.split('T')[0];
        return fechaGasto <= this.filtroFechaHasta;
      });
    }

    this.gastosFiltrados = resultado;
  }

  generarCarrilFechas(): void {
    this.diasCarril = [];
    
    if (!this.filtroFechaDesde || !this.filtroFechaHasta) {
      return;
    }

    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const [yearInicio, mesInicio, diaInicio] = this.filtroFechaDesde.split('-').map(Number);
    const [yearFin, mesFin, diaFin] = this.filtroFechaHasta.split('-').map(Number);
    
    const fechaInicio = new Date(yearInicio, mesInicio - 1, diaInicio);
    const fechaFin = new Date(yearFin, mesFin - 1, diaFin);
    
    let fechaActual = new Date(fechaInicio);
    
    while (fechaActual <= fechaFin) {
      this.diasCarril.push({
        fecha: new Date(fechaActual),
        dia: diasSemana[fechaActual.getDay()],
        numero: fechaActual.getDate(),
        mes: meses[fechaActual.getMonth()],
        activo: false
      });
      
      fechaActual.setDate(fechaActual.getDate() + 1);
    }
  }

  seleccionarDiaCarril(dia: any): void {
    this.diasCarril.forEach(d => d.activo = false);
    dia.activo = true;
    
    const year = dia.fecha.getFullYear();
    const month = String(dia.fecha.getMonth() + 1).padStart(2, '0');
    const day = String(dia.fecha.getDate()).padStart(2, '0');
    this.fechaSeleccionada = `${year}-${month}-${day}`;
    
    this.gastosFiltrados = this.gastos.filter(gasto => {
      const fechaGasto = gasto.fecha.split('T')[0];
      return fechaGasto === this.fechaSeleccionada;
    });
  }

  limpiarSeleccionDia(): void {
    this.fechaSeleccionada = null;
    this.diasCarril.forEach(d => d.activo = false);
    this.aplicarFiltros();
  }

  onFiltroChange(): void {
    this.limpiarSeleccionDia();
    this.generarCarrilFechas();
    this.aplicarFiltros();
  }

  formatearFecha(fecha: string): string {
    const [year, month, day] = fecha.split('T')[0].split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    const opciones: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    };
    
    return date.toLocaleDateString('es-PE', opciones);
  }

  // ========== FORMULARIO GASTO ==========

  abrirFormulario() {
    this.mostrarFormulario = true;
    
    // Si hay presupuesto seleccionado, asignarlo automáticamente
    if (this.presupuestoSeleccionado) {
      this.nuevoGasto.presupuesto_id = this.presupuestoSeleccionado.id;
    }
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.resetearFormulario();
  }

  onTipoChange() {
    const tipoId = this.nuevoGasto.tipo_id;
    this.mostrarOtroTipo = String(tipoId) === '-1';
    
    if (!this.mostrarOtroTipo) {
      this.nuevoTipoNombre = '';
    }
  }

  guardarGasto() {
    if (String(this.nuevoGasto.tipo_id) === '-1' && this.nuevoTipoNombre) {
      // ✅ NUEVA LÓGICA: Crear tipo localmente ANTES de enviar el gasto
      // Generar un ID temporal (será reemplazado por el servidor)
      const nuevoTipoId = Math.max(...this.tipos.map(t => t.id || 0), 0) + 1;
      const nuevoTipo: Tipo = {
        id: nuevoTipoId,
        nombre: this.nuevoTipoNombre
      };
      
      // Agregar el tipo a la lista local INMEDIATAMENTE
      this.tipos.push(nuevoTipo);
      console.log('✅ Tipo agregado localmente:', nuevoTipo);
      
      const gastoConTipo = {
        ...this.nuevoGasto,
        tipo_nombre: this.nuevoTipoNombre,
        tipo_id: nuevoTipoId // Usar el tipo local
      };
      
      this.gastoService.crearGasto(gastoConTipo).subscribe({
        next: (gastoCreado) => {
          // Si el servidor devuelve un tipo con ID diferente, actualizar el local
          if (gastoCreado.tipo && gastoCreado.tipo.id && gastoCreado.tipo.id !== nuevoTipoId) {
            const indice = this.tipos.findIndex(t => t.id === nuevoTipoId);
            if (indice !== -1) {
              this.tipos[indice] = gastoCreado.tipo;
              console.log('✅ Tipo actualizado con ID del servidor:', gastoCreado.tipo);
            }
          }
          
          this.cargarGastos();
          this.cargarPresupuestos();
          this.cerrarFormulario();
        },
        error: (err) => {
          console.error('Error guardando gasto:', err);
          // Remover el tipo local si hay error
          const indice = this.tipos.findIndex(t => t.id === nuevoTipoId);
          if (indice !== -1) {
            this.tipos.splice(indice, 1);
            console.log('❌ Tipo removido por error en guardado');
          }
          alert(err.error?.message || 'Error al guardar el gasto');
        }
      });
    } else if (String(this.nuevoGasto.tipo_id) === '-1') {
      alert('Por favor escribe el nombre del nuevo tipo');
    } else {
      this.gastoService.crearGasto(this.nuevoGasto).subscribe({
        next: () => {
          this.cargarGastos();
          this.cargarPresupuestos();
          this.cerrarFormulario();
        },
        error: (err) => {
          console.error('Error guardando gasto:', err);
          alert(err.error?.message || 'Error al guardar el gasto');
        }
      });
    }
  }

  eliminarGasto(id: number) {
    if (confirm('¿Eliminar este gasto?')) {
      this.gastoService.eliminarGasto(id).subscribe({
        next: () => {
          this.cargarGastos();
          this.cargarPresupuestos();
        },
        error: (err) => console.error('Error eliminando:', err)
      });
    }
  }

  resetearFormulario() {
    this.nuevoGasto = {
      monto: 0,
      moneda: 'PEN',
      fecha: new Date().toISOString().split('T')[0],
      descripcion: '',
      lugar: '',
      pagado: true,
      tipo_id: undefined,
      presupuesto_id: this.presupuestoSeleccionado?.id
    };
    this.nuevoTipoNombre = '';
    this.mostrarOtroTipo = false;
  }

  // ========== FORMULARIO PRESUPUESTO ==========

  abrirFormularioPresupuesto() {
    this.mostrarFormularioPresupuesto = true;
  }

  cerrarFormularioPresupuesto() {
    this.mostrarFormularioPresupuesto = false;
    this.resetearFormularioPresupuesto();
  }

  guardarPresupuesto() {
    if (!this.nuevoPresupuesto.nombre || !this.nuevoPresupuesto.monto_total) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    this.gastoService.crearPresupuesto(this.nuevoPresupuesto).subscribe({
      next: (presupuesto) => {
        this.cargarPresupuestos();
        this.cerrarFormularioPresupuesto();
        this.seleccionarPresupuesto(presupuesto);
      },
      error: (err) => {
        console.error('Error guardando presupuesto:', err);
        alert('Error al crear el presupuesto');
      }
    });
  }

  eliminarPresupuesto(id: number, event: Event) {
    event.stopPropagation();
    
    if (confirm('¿Eliminar este presupuesto? Se eliminarán todos los gastos asociados.')) {
      this.gastoService.eliminarPresupuesto(id).subscribe({
        next: () => {
          this.cargarPresupuestos();
          if (this.presupuestoSeleccionado?.id === id) {
            this.seleccionarPresupuesto(null);
          }
        },
        error: (err) => console.error('Error eliminando presupuesto:', err)
      });
    }
  }

  resetearFormularioPresupuesto() {
    this.nuevoPresupuesto = {
      nombre: '',
      monto_total: 0,
      moneda: 'PEN',
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_fin: undefined  // 👈 CORREGIDO: undefined en lugar de null
    };
  }

  // ========== UTILIDADES ==========

  calcularTotal(): number {
    return this.gastosFiltrados.reduce((sum, g) => sum + Number(g.monto), 0);
  }

  calcularPorcentajePresupuesto(): number {
    if (!this.presupuestoSeleccionado || !this.presupuestoSeleccionado.monto_total) {
      return 0;
    }
    
    const total = this.presupuestoSeleccionado.total_gastado || 0;
    return Math.round((total / this.presupuestoSeleccionado.monto_total) * 100);
  }

  obtenerColorPorcentaje(): string {
    const porcentaje = this.calcularPorcentajePresupuesto();
    
    if (porcentaje < 50) return '#10b981'; // verde
    if (porcentaje < 75) return '#f59e0b'; // amarillo
    if (porcentaje < 90) return '#f97316'; // naranja
    return '#ef4444'; // rojo
  }

  limpiarFiltros() {
    this.filtroTipo = 'todos';
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    this.filtroPresupuesto = 'todos';
    this.limpiarSeleccionDia();
    this.diasCarril = [];
    this.aplicarFiltros();
  }

  hayFiltrosActivos(): boolean {
    return this.filtroTipo !== 'todos' || 
           this.filtroFechaDesde !== '' || 
           this.filtroFechaHasta !== '' ||
           this.fechaSeleccionada !== null ||
           this.filtroPresupuesto !== 'todos';
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}
