import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Tipo {
  id: number;
  nombre: string;
  color?: string;
}

export interface Gasto {
  id?: number;
  usuario_id?: number;
  presupuesto_id?: number;
  tipo_id?: number;
  tipo?: Tipo;
  presupuesto?: Presupuesto;
  monto: number;
  moneda: string;
  fecha: string;
  descripcion?: string;
  lugar?: string;
  pagado: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Presupuesto {
  id?: number;
  usuario_id?: number;
  nombre: string;
  monto_total: number;
  moneda: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  created_at?: string;
  updated_at?: string;
  // Campos calculados que vienen del backend
  gastos_count?: number;
  gastos_sum_monto?: number;
  total_gastado?: number;
  saldo_restante?: number;
  porcentaje_utilizado?: number;
  gastos?: Gasto[];
  gastos_por_tipo?: any;
  estado?: 'activo' | 'completado' | 'excedido';
}

export interface EstadisticasPresupuestoDetallado {
  presupuesto: {
    id: number;
    nombre: string;
    monto_total: number;
    moneda: string;
  };
  resumen: {
    total_gastado: number;
    saldo_restante: number;
    porcentaje_utilizado: number;
    cantidad_gastos: number;
    promedio_por_gasto: number;
    promedio_diario: number;
  };
  gastos_por_tipo: Array<{
    tipo: string;
    cantidad: number;
    total: number;
  }>;
  gastos_por_dia: Array<{
    fecha: string;
    cantidad: number;
    total: number;
  }>;
}

export interface EstadisticasPresupuesto {
  presupuesto: {
    id: number;
    nombre: string;
    monto_total: number;
    moneda: string;
  };
  resumen: {
    total_gastado: number;
    saldo_restante: number;
    porcentaje_utilizado: number;
    cantidad_gastos: number;
    promedio_por_gasto: number;
    promedio_diario: number;
  };
  gastos_por_tipo: Array<{
    tipo: string;
    cantidad: number;
    total: number;
  }>;
  gastos_por_dia: Array<{
    fecha: string;
    cantidad: number;
    total: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class GastoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ========== TIPOS ==========
  getTipos(): Observable<Tipo[]> {
    return this.http.get<Tipo[]>(`${this.apiUrl}/tipos`);
  }

  crearTipo(tipo: Partial<Tipo>): Observable<Tipo> {
    return this.http.post<Tipo>(`${this.apiUrl}/tipos`, tipo);
  }

  // ========== GASTOS ==========
  getGastos(filtros?: { presupuesto_id?: number }): Observable<Gasto[]> {
    let params = new HttpParams();
    
    if (filtros?.presupuesto_id) {
      params = params.set('presupuesto_id', filtros.presupuesto_id.toString());
    }
    
    return this.http.get<Gasto[]>(`${this.apiUrl}/gastos`, { params });
  }

  getGasto(id: number): Observable<Gasto> {
    return this.http.get<Gasto>(`${this.apiUrl}/gastos/${id}`);
  }

  crearGasto(gasto: Partial<Gasto>): Observable<Gasto> {
    return this.http.post<Gasto>(`${this.apiUrl}/gastos`, gasto);
  }

  actualizarGasto(id: number, gasto: Partial<Gasto>): Observable<Gasto> {
    return this.http.put<Gasto>(`${this.apiUrl}/gastos/${id}`, gasto);
  }

  eliminarGasto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/gastos/${id}`);
  }

  // ========== PRESUPUESTOS ==========
  getPresupuestos(): Observable<Presupuesto[]> {
    return this.http.get<Presupuesto[]>(`${this.apiUrl}/presupuestos`);
  }

  getPresupuesto(id: number): Observable<Presupuesto> {
    return this.http.get<Presupuesto>(`${this.apiUrl}/presupuestos/${id}`);
  }

  crearPresupuesto(presupuesto: Partial<Presupuesto>): Observable<Presupuesto> {
    return this.http.post<Presupuesto>(`${this.apiUrl}/presupuestos`, presupuesto);
  }

  actualizarPresupuesto(id: number, presupuesto: Partial<Presupuesto>): Observable<Presupuesto> {
    return this.http.put<Presupuesto>(`${this.apiUrl}/presupuestos/${id}`, presupuesto);
  }

  eliminarPresupuesto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/presupuestos/${id}`);
  }

  getEstadisticasPresupuesto(id: number): Observable<EstadisticasPresupuesto> {
    return this.http.get<EstadisticasPresupuesto>(`${this.apiUrl}/presupuestos/${id}/estadisticas`);
  }
}