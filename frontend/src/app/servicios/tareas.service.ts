import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NuevaTareaInfo } from '../tarea/tarea.model';
import { Subject, tap, switchMap, startWith } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TareasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tareas`;
  private _refresh$ = new Subject<void>();

  get refresh$() { return this._refresh$; }

  obtenerTareasDeUsuario(idUsuario: string) {
    return this.refresh$.pipe(
      startWith(null),
      switchMap(() => this.http.get<any[]>(`${this.apiUrl}/${idUsuario}`))
    );
  }

  agregarTarea(infoDeTarea: NuevaTareaInfo, idUsuario: string) {
    const nuevaTarea = {
      id: new Date().getTime().toString(),
      titulo: infoDeTarea.titulo,
      resumen: infoDeTarea.resumen,
      expira: infoDeTarea.fecha,
      idusuario: idUsuario
    };
    return this.http.post(this.apiUrl, nuevaTarea).pipe(tap(() => this._refresh$.next()));
  }

  // MÉTODO PARA COMPLETAR (Poner el 1 en Workbench)
  completarTarea(id: string) {
    return this.http.patch(`${this.apiUrl}/${id}`, {}).pipe(tap(() => this._refresh$.next()));
  }

  // MÉTODO PARA EDITAR TAREA
  editarTarea(id: string, infoDeTarea: NuevaTareaInfo) {
    const tareaEditada = {
      titulo: infoDeTarea.titulo,
      resumen: infoDeTarea.resumen,
      expira: infoDeTarea.fecha
    };
    return this.http.put(`${this.apiUrl}/${id}`, tareaEditada).pipe(tap(() => this._refresh$.next()));
  }

  // MÉTODO PARA ELIMINAR (Borrar fila en Workbench)
  eliminarTareaFisicamente(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(tap(() => this._refresh$.next()));
  }
}
