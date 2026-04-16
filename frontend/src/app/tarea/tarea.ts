import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Tarjeta } from '../componentes/tarjeta/tarjeta';
import { DatePipe, CommonModule } from '@angular/common';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-tarea',
  standalone: true,
  imports: [Tarjeta, DatePipe, CommonModule],
  templateUrl: './tarea.html',
  styleUrl: './tarea.css',
})
export class Tarea {
  @Input({ required: true }) tarea!: any;

  @Output() completar = new EventEmitter<string>();
  @Output() eliminar = new EventEmitter<string>();
  @Output() editar = new EventEmitter<any>();
  
  public authService = inject(AuthService);

  onCompletar() {
    this.completar.emit(this.tarea.id);
  }

  onEditar() {
    this.editar.emit(this.tarea);
  }

  onEliminar() {
    this.eliminar.emit(this.tarea.id);
  }
}
