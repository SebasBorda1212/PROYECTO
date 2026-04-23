import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuarios } from '../componentes/usuario/usuario.model';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  // Signal reactiva para almacenar globalmente el estado de usuarios sin recargas manuales
  public usuarios = signal<Usuarios[]>([]);

  constructor() {
    this.cargarUsuarios();
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });
  }

  cargarUsuarios() {
    this.http.get<Usuarios[]>(this.apiUrl).subscribe({
      next: (data) => this.usuarios.set(data),
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }

  crearUsuario(usuario: Usuarios) {
    return this.http.post(this.apiUrl, usuario, { headers: this.getAuthHeaders() }).pipe(
      tap(() => {
        // Actualización reactiva con signals (añadir)
        this.usuarios.update(users => [...users, usuario]);
      })
    );
  }

  editarUsuario(id: string, nombre: string, avatar: string) {
    return this.http.put(`${this.apiUrl}/${id}`, { nombre, avatar }, { headers: this.getAuthHeaders() }).pipe(
      tap(() => {
        // Actualización reactiva con signals (modificar)
        this.usuarios.update(users => 
          users.map(u => u.id === id ? { ...u, nombre, avatar } : u)
        );
      })
    );
  }

  eliminarUsuario(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      tap(() => {
        // Actualización reactiva con signals (filtrar)
        this.usuarios.update(users => users.filter(u => u.id !== id));
      })
    );
  }
}
