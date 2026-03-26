import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tarjeta } from '../componentes/tarjeta/tarjeta';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tarea',
  standalone: true,
  imports: [Tarjeta, DatePipe],
  templateUrl: './tarea.html',
  styleUrl: './tarea.css',
})
export class Tarea {
  @Input({ required: true }) tarea!: any;

  @Output() completar = new EventEmitter<string>();
  @Output() eliminar = new EventEmitter<string>();

  onCompletar() {
    this.completar.emit(this.tarea.id);
  }

  onEliminar() {
    this.eliminar.emit(this.tarea.id);
  }
}
