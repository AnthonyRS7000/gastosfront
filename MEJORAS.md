# 🚀 Guía de Mejoras Adicionales

Este archivo contiene mejoras opcionales que puedes implementar para mejorar aún más la aplicación.

---

## 1. 🔐 Guard de Autenticación

Crea un archivo `src/app/guards/auth.guard.ts`:

```typescript
import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

Luego actualiza `app.routes.ts`:

```typescript
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/presupuestos', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'presupuestos', component: PresupuestosComponent, canActivate: [authGuard] },
  { path: 'presupuesto/:id', component: PresupuestoDetalleComponent, canActivate: [authGuard] },
  { path: 'gastos', component: GastosComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/presupuestos' }
];
```

---

## 2. 🎨 Tema Personalizable

Crea `src/app/services/theme.service.ts`:

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = signal<'light' | 'dark'>('light');

  toggleTheme() {
    this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
    localStorage.setItem('theme', this.theme());
  }

  loadTheme() {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      this.theme.set(saved);
    }
  }
}
```

En `app.ts`:

```typescript
import { ThemeService } from './services/theme.service';

export class App {
  constructor(themeService: ThemeService) {
    themeService.loadTheme();
  }
}
```

---

## 3. 📊 Gráficos Avanzados

Instala Chart.js:

```bash
npm install chart.js ng2-charts
```

En `presupuesto-detalle.component.ts`, agrega:

```typescript
import { ChartOptions, ChartData } from 'chart.js';

export class PresupuestoDetalleComponent {
  chartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#667eea', '#764ba2', '#f59e0b', '#ef4444', '#10b981'
      ]
    }]
  };

  ngOnInit() {
    this.cargarGraficos();
  }

  cargarGraficos() {
    if (this.estadisticas) {
      this.chartData.labels = this.estadisticas.gastos_por_tipo.map(g => g.tipo);
      this.chartData.datasets[0].data = this.estadisticas.gastos_por_tipo.map(g => g.total);
    }
  }
}
```

---

## 4. 📱 Notificaciones Toast

Crea `src/app/services/notification.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type
    };

    const current = this.notifications$.value;
    this.notifications$.next([...current, notification]);

    setTimeout(() => this.remove(notification.id), 3000);
  }

  remove(id: string) {
    const current = this.notifications$.value;
    this.notifications$.next(current.filter(n => n.id !== id));
  }

  getNotifications() {
    return this.notifications$.asObservable();
  }
}
```

---

## 5. 💾 Sincronización Local

Mejora el servicio para sincronizar con IndexedDB:

```typescript
import Dexie, { Table } from 'dexie';

export class GastosDB extends Dexie {
  gastos!: Table<Gasto>;
  presupuestos!: Table<Presupuesto>;

  constructor() {
    super('gastos-db');
    this.version(1).stores({
      gastos: '++id, presupuesto_id',
      presupuestos: '++id'
    });
  }
}
```

---

## 6. 📊 Exportar a CSV/PDF

```typescript
// En gasto.service.ts
exportToCSV(gastos: Gasto[], presupuesto: Presupuesto) {
  const headers = ['Fecha', 'Descripción', 'Tipo', 'Monto', 'Estado'];
  const rows = gastos.map(g => [
    g.fecha,
    g.descripcion,
    g.tipo?.nombre,
    g.monto,
    g.pagado ? 'Pagado' : 'Pendiente'
  ]);

  const csv = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `gastos-${presupuesto.nombre}.csv`;
  link.click();
}
```

---

## 7. 🔔 Notificaciones de Límite

En `presupuesto-detalle.component.ts`:

```typescript
verificarLimites() {
  if (this.presupuesto) {
    const porcentaje = this.presupuesto.porcentaje_utilizado || 0;
    
    if (porcentaje >= 100) {
      this.notificationService.show(
        'Has excedido el presupuesto',
        'error'
      );
    } else if (porcentaje >= 80) {
      this.notificationService.show(
        'Has alcanzado el 80% del presupuesto',
        'warning'
      );
    }
  }
}
```

---

## 8. 🌐 Internacionalización (i18n)

```bash
npm install @angular/localize
```

Crea archivos de traducción y usa `$localize`:

```typescript
<h1>{{ $localize`Mis Presupuestos` }}</h1>
```

---

## 9. ♿ Accesibilidad

Mejora ARIA labels:

```html
<button 
  class="btn-nuevo-gasto"
  (click)="toggleFormulario()"
  aria-label="Crear nuevo gasto"
  [attr.aria-expanded]="mostrarFormulario"
>
  ➕ Nuevo Gasto
</button>
```

---

## 10. 🧪 Testing

```typescript
// presupuesto.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GastoService } from './gasto.service';

describe('GastoService', () => {
  let service: GastoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GastoService]
    });
    service = TestBed.inject(GastoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch presupuestos', () => {
    const mockPresupuestos = [{ id: 1, nombre: 'Test' }];
    
    service.getPresupuestos().subscribe(data => {
      expect(data.length).toBe(1);
      expect(data[0].nombre).toBe('Test');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/presupuestos');
    expect(req.request.method).toBe('GET');
    req.flush(mockPresupuestos);
  });
});
```

---

## 11. 🚀 PWA (Progressive Web App)

```bash
ng add @angular/pwa
```

---

## 12. 📈 Analytics

```typescript
// services/analytics.service.ts
import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  logEvent(eventName: string, eventParams: any) {
    gtag('event', eventName, eventParams);
  }

  trackPresupuestoCreado(presupuesto: Presupuesto) {
    this.logEvent('presupuesto_creado', {
      presupuesto_id: presupuesto.id,
      monto: presupuesto.monto_total
    });
  }
}
```

---

## 13. ⏱️ Cache Inteligente

```typescript
// Mejorar gasto.service.ts
import { shareReplay } from 'rxjs/operators';

private presupuestosCache$ = new Map<number, Observable<Presupuesto>>();

getPresupuesto(id: number): Observable<Presupuesto> {
  if (!this.presupuestosCache$.has(id)) {
    this.presupuestosCache$.set(
      id,
      this.http.get<Presupuesto>(`${this.apiUrl}/presupuestos/${id}`)
        .pipe(shareReplay(1))
    );
  }
  return this.presupuestosCache$.get(id)!;
}

invalidatePresupuestoCache(id: number) {
  this.presupuestosCache$.delete(id);
}
```

---

## 14. 🎯 Validaciones Avanzadas

```typescript
// validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function presupuestoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const monto = control.get('monto_total')?.value;
    const fecha_inicio = control.get('fecha_inicio')?.value;
    const fecha_fin = control.get('fecha_fin')?.value;

    if (fecha_inicio && fecha_fin && new Date(fecha_inicio) > new Date(fecha_fin)) {
      return { 'fechasInvalidas': true };
    }

    if (monto && monto < 0) {
      return { 'montoNegativo': true };
    }

    return null;
  };
}
```

---

## 15. 🔄 Refresh Automático

```typescript
// presupuesto-detalle.component.ts
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
  
  // Refreshear cada 30 segundos
  interval(30000)
    .pipe(
      switchMap(() => this.gastoService.getPresupuesto(Number(id)))
    )
    .subscribe(presupuesto => {
      this.presupuesto = presupuesto;
    });
}
```

---

## ¡Elige las mejoras que más te interesen e impleméntalas! 🎉
