import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NuevaTareaInfo } from '../tarea/tarea.model';

@Injectable({
  providedIn: 'root',
})
export class TareasService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/tareas';

  // Ahora pedimos las tareas específicas del usuario seleccionado
  obtenerTareasDeUsuario(idUsuario: string) {
    return this.http.get<any[]>(`${this.apiUrl}/${idUsuario}`);
  }

  agregarTarea(infoDeTarea: NuevaTareaInfo, idUsuario: string) {
    const nuevaTarea = {
      id: new Date().getTime().toString(),
      titulo: infoDeTarea.titulo,
      resumen: infoDeTarea.resumen,
      expira: infoDeTarea.fecha,
      idusuario: idUsuario
    };
    return this.http.post(this.apiUrl, nuevaTarea);
  }

  eliminarTarea(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
