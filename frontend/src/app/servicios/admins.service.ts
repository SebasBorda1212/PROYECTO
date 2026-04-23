import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admins`;
  
  admins = signal<any[]>([]);

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  cargarAdmins() {
    this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (data) => this.admins.set(data),
      error: (err) => console.error('Error al cargar admins:', err)
    });
  }

  crearAdmin(admin: any) {
    return this.http.post(this.apiUrl, admin, { headers: this.getHeaders() }).pipe(
      tap(() => this.cargarAdmins())
    );
  }

  eliminarAdmin(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => this.cargarAdmins())
    );
  }
}
