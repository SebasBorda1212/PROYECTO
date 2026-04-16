import { Component, Input, inject, OnChanges, SimpleChanges } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Tarea } from "../../tarea/tarea";
import { NuevaTarea } from "../nueva-tarea/nueva-tarea";
import { TareasService } from '../../servicios/tareas.service';
import { AuthService } from '../../servicios/auth.service';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators'; // imported delay to simulate loading or just for future

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [Tarea, NuevaTarea, AsyncPipe, CommonModule],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css',
})
export class Tareas implements OnChanges {
  @Input({ required: true }) nombre!: string;
  @Input({ required: true }) idUsuario!: string;

  estaAgregandoTareaNueva = false;
  tareaAEditar?: any;
  tareas$!: Observable<any[]>;

  private tareasService = inject(TareasService);
  public authService = inject(AuthService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idUsuario']) {
      this.cargarTareas();
    }
  }

  cargarTareas() {
    this.tareas$ = this.tareasService.obtenerTareasDeUsuario(this.idUsuario);
  }

  alIniciarNuevaTarea() { this.estaAgregandoTareaNueva = true; }
  
  alEditarTarea(tarea: any) {
    this.tareaAEditar = tarea;
    this.estaAgregandoTareaNueva = true;
  }

  alCerrarTareaNueva() { 
    this.estaAgregandoTareaNueva = false;
    this.tareaAEditar = undefined;
    this.cargarTareas(); // Reload tasks after closing
  }

  alCompletarTarea(id: string) {
    this.tareasService.completarTarea(id).subscribe({
      next: () => {
        console.log('✅ Marcada como completada');
        this.cargarTareas();
      },
      error: (err: any) => console.error('❌ Error al completar:', err)
    });
  }

  alEliminarTarea(id: string) {
    this.tareasService.eliminarTareaFisicamente(id).subscribe({
      next: () => {
        console.log('🗑️ Eliminada de la base de datos');
        this.cargarTareas();
      },
      error: (err: any) => console.error('❌ Error al eliminar:', err)
    });
  }
}
