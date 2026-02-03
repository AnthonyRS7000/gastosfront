import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';


interface Usuario {
  id: number;
  nombre: string;
  email: string;
}


interface AuthResponse {
  usuario: Usuario;
  token: string;  // ← CORREGIDO: El backend envía "token", NO "access_token"
  token_type: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();


  constructor(private http: HttpClient) {
    // Solo recuperar el token del localStorage, sin hacer HTTP requests aquí
    const token = this.getToken();
    if (token) {
      console.log('🔄 Token encontrado al iniciar');
    } else {
      console.log('❌ No hay token al iniciar');
    }
  }


  register(nombre: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      nombre,
      email,
      password,
      device_name: 'gastosfront'
    }).pipe(
      tap(response => {
        console.log('✅ Register response:', response);
        this.saveToken(response.token);  // ← CORREGIDO
        this.currentUserSubject.next(response.usuario);
      })
    );
  }


  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      email,
      password,
      device_name: 'gastosfront'
    }).pipe(
      tap(response => {
        console.log('✅ Login response:', response);
        console.log('🎫 Token recibido:', response.token);  // ← CORREGIDO
        this.saveToken(response.token);  // ← CORREGIDO
        console.log('💾 Token guardado');
        this.currentUserSubject.next(response.usuario);
      })
    );
  }


  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.removeToken();
        this.currentUserSubject.next(null);
      })
    );
  }


  loadCurrentUser(): Observable<Usuario | null> {
    const token = this.getToken();
    
    if (!token) {
      console.log('❌ No hay token, no se puede cargar usuario');
      return of(null);
    }

    return this.http.get<Usuario>(`${this.apiUrl}/me`).pipe(
      tap((usuario) => {
        console.log('✅ Usuario cargado:', usuario);
        this.currentUserSubject.next(usuario);
      }),
      catchError((error) => {
        console.error('❌ Error cargando usuario, removiendo token:', error);
        this.removeToken();
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }


  saveToken(token: string): void {
    console.log('💾 Guardando token:', token);  // ← SIMPLIFICADO (quité el substring)
    localStorage.setItem('auth_token', token);
  }


  getToken(): string | null {
    const token = localStorage.getItem('auth_token');
    console.log('🔍 getToken() llamado, token:', token ? 'SÍ HAY' : 'NO HAY');
    return token;
  }


  removeToken(): void {
    localStorage.removeItem('auth_token');
  }


  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
