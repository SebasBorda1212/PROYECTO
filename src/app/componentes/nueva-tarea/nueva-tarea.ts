import { Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NuevaTareaInfo } from '../../tarea/tarea.model';
import { TareasService } from '../../servicios/tareas.service';
import { required } from '@angular/forms/signals';

@Component({
  selector: 'app-nueva-tarea',
  imports: [FormsModule],
  templateUrl: './nueva-tarea.html',
  styleUrl: './nueva-tarea.css',
})
export class NuevaTarea {
  @Input({ required: true }) idUsuario!: string;
  @Output() cerrar = new EventEmitter<void>(); 

  
  tituloIngresado = '';
  resumenIngresado = '';
  fechaIngresado = '';

  private tareasService = inject(TareasService);
   
  alCancelar() {
    this.cerrar.emit();
  }

  alEnviar() {
    this.tareasService.agregarTarea({
      titulo: this.resumenIngresado,
      resumen: this.resumenIngresado,
      fecha: this.fechaIngresado
    }, this.idUsuario)
     this.cerrar.emit();
  }
}
