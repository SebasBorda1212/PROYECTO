import { Component, Input, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Tarea } from "../../tarea/tarea";
import { NuevaTarea } from "../nueva-tarea/nueva-tarea";
import { TareasService } from '../../servicios/tareas.service';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [Tarea, NuevaTarea, AsyncPipe],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css',
})
export class Tareas {
  @Input({ required: true }) nombre!: string;
  @Input({ required: true }) idUsuario!: string;

  estaAgregandoTareaNueva = false;
  private tareasService = inject(TareasService);

  // Esta función se dispara automáticamente cuando cambia el idUsuario
  get tareasUsuarioSeleccionado() {
    return this.tareasService.obtenerTareasDeUsuario(this.idUsuario);
  }

  alIniciarNuevaTarea() {
    this.estaAgregandoTareaNueva = true;
  }

  alCerrarTareaNueva() {
    this.estaAgregandoTareaNueva = false;
  }

  alCompletarTarea(id: string) {
    this.tareasService.eliminarTarea(id).subscribe({
      next: () => console.log('Tarea completada'),
      error: (err) => console.error(err)
    });
  }
}
