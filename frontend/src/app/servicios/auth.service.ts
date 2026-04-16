import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/login`;
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  // Usamos BehaviorSubject para que los componentes reaccionen al estado de login
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  
  private usernameSubject = new BehaviorSubject<string | null>(null);
  public username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.isBrowser) {
      this.isLoggedInSubject.next(this.hasToken());
      this.usernameSubject.next(this.getUsername());
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      tap(res => {
        if (res && res.token && this.isBrowser) {
          localStorage.setItem('auth_token', res.token);
          localStorage.setItem('admin_username', res.username);
          this.isLoggedInSubject.next(true);
          this.usernameSubject.next(res.username);
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('admin_username');
    }
    this.isLoggedInSubject.next(false);
    this.usernameSubject.next(null);
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private hasToken(): boolean {
    if (this.isBrowser) {
      return !!localStorage.getItem('auth_token');
    }
    return false;
  }

  private getUsername(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('admin_username');
    }
    return null;
  }

  // ADMINISTRACIÓN: Registrar nuevo Admin
  registrarAdmin(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/administradores`, { username, password });
  }

  // PERFIL: Actualizar datos propios
  actualizarPerfil(username: string, password?: string): Observable<any> {
    const data: any = { username };
    if (password) data.password = password;
    return this.http.patch<any>(`${environment.apiUrl}/administradores/perfil`, data).pipe(
      tap(res => {
        if (this.isBrowser && res) {
          localStorage.setItem('admin_username', username);
          this.usernameSubject.next(username);
        }
      })
    );
  }
}
