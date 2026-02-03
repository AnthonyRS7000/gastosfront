import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Primero check rápido: ¿hay token?
  if (!authService.getToken()) {
    console.log('🚫 No hay token, redirigiendo a login');
    router.navigate(['/login']);
    return false;
  }

  // Si hay token, cargar el usuario y esperar respuesta
  return authService.loadCurrentUser().pipe(
    map((usuario) => {
      if (usuario) {
        console.log('✅ Usuario autenticado, permitiendo acceso');
        return true;
      } else {
        console.log('❌ No se pudo cargar usuario, redirigiendo a login');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
