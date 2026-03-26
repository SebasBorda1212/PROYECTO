import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TareasService } from '../../servicios/tareas.service';

@Component({
  selector: 'app-nueva-tarea',
  standalone: true,
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
    // Validamos que no envíe campos vacíos
    if (!this.tituloIngresado || !this.resumenIngresado || !this.fechaIngresado) {
      alert('Por favor, completa todos los campos');
      return;
    }

    this.tareasService.agregarTarea({
      titulo: this.tituloIngresado, // CORREGIDO
      resumen: this.resumenIngresado,
      fecha: this.fechaIngresado
    }, this.idUsuario).subscribe({
      next: (res) => {
        console.log('✅ Respuesta del servidor:', res);
        this.cerrar.emit();
      },
      error: (err) => {
        console.error('❌ Error al enviar:', err);
        alert('No se pudo conectar con el servidor. ¿Olvidaste encender el backend?');
      }
    });
  }
}
