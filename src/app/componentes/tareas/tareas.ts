import { Component, Input, inject, OnChanges, SimpleChanges } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Tarea } from "../../tarea/tarea";
import { NuevaTarea } from "../nueva-tarea/nueva-tarea";
import { TareasService } from '../../servicios/tareas.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [Tarea, NuevaTarea, AsyncPipe],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css',
})
export class Tareas implements OnChanges {
  @Input({ required: true }) nombre!: string;
  @Input({ required: true }) idUsuario!: string;

  estaAgregandoTareaNueva = false;
  tareas$!: Observable<any[]>;

  private tareasService = inject(TareasService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idUsuario']) {
      this.tareas$ = this.tareasService.obtenerTareasDeUsuario(this.idUsuario);
    }
  }

  alIniciarNuevaTarea() { this.estaAgregandoTareaNueva = true; }
  alCerrarTareaNueva() { this.estaAgregandoTareaNueva = false; }

  // Cambiado de eliminarTarea a completarTarea para coincidir con el servicio
  alCompletarTarea(id: string) {
    this.tareasService.completarTarea(id).subscribe({
      next: () => console.log('✅ Marcada como completada'),
      error: (err: any) => console.error('❌ Error al completar:', err)
    });
  }

  // Nueva función para el botón de borrar físicamente
  alEliminarTarea(id: string) {
    this.tareasService.eliminarTareaFisicamente(id).subscribe({
      next: () => console.log('🗑️ Eliminada de la base de datos'),
      error: (err: any) => console.error('❌ Error al eliminar:', err)
    });
  }
}
