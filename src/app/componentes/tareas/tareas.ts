import { Component,Input } from '@angular/core';
import { Tarea } from "../../tarea/tarea";
import { required } from '@angular/forms/signals';
import { NuevaTarea } from "../nueva-tarea/nueva-tarea";
import { NuevaTareaInfo } from '../../tarea/tarea.model';
import { TareasService } from '../../servicios/tareas.service';


@Component({
  selector: 'app-tareas',
  imports: [Tarea, NuevaTarea],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css',
})
export class Tareas {
  @Input({required: true}) nombre!: string;
  @Input({ required: true }) idUsuario!: string;
  estaAgregandoTareaNueva = false;

  constructor(private tareasService: TareasService) { }

  get tareasUsuarioSeleccionado() {
      return this.tareasService.obtenerTareasDeUsuario(this.idUsuario)
    }

  alCompletarTarea(id: string) {
    
  }

  alIniciarNuevaTarea() {
    this.estaAgregandoTareaNueva = true;
  }

  alCerrarTareaNueva() {
    this.estaAgregandoTareaNueva = false;
  }

  
}
