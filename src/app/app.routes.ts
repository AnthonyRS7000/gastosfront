import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { GastosComponent } from './components/gastos/gastos';
import { PresupuestosComponent } from './components/presupuestos/presupuestos.component';
import { PresupuestoDetalleComponent } from './components/presupuesto-detalle/presupuesto-detalle.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'presupuestos', component: PresupuestosComponent, canActivate: [authGuard] },
  { path: 'presupuesto/:id', component: PresupuestoDetalleComponent, canActivate: [authGuard] },
  { path: 'gastos', component: GastosComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
