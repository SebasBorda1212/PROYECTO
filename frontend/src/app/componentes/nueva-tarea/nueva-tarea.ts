import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TareasService } from '../../servicios/tareas.service';

@Component({
  selector: 'app-nueva-tarea',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nueva-tarea.html',
  styleUrl: './nueva-tarea.css',
})
export class NuevaTarea implements OnInit {
  @Input({ required: true }) idUsuario!: string;
  @Input() tarea?: any;
  @Output() cerrar = new EventEmitter<void>();

  tituloIngresado = '';
  resumenIngresado = '';
  fechaIngresado = '';

  private tareasService = inject(TareasService);

  ngOnInit() {
    if (this.tarea) {
      this.tituloIngresado = this.tarea.titulo;
      this.resumenIngresado = this.tarea.resumen;
      this.fechaIngresado = this.tarea.expira;
    }
  }

  alCancelar() {
    this.cerrar.emit();
  }

  alEnviar() {
    // Validamos que no envíe campos vacíos
    if (!this.tituloIngresado || !this.resumenIngresado || !this.fechaIngresado) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const infoTarea = {
      titulo: this.tituloIngresado,
      resumen: this.resumenIngresado,
      fecha: this.fechaIngresado
    };

    const observable = this.tarea 
      ? this.tareasService.editarTarea(this.tarea.id, infoTarea)
      : this.tareasService.agregarTarea(infoTarea, this.idUsuario);

    observable.subscribe({
      next: (res) => {
        console.log('✅ Operación exitosa:', res);
        this.cerrar.emit();
      },
      error: (err) => {
        console.error('❌ Error al enviar:', err);
        if (err.status === 401 || err.status === 403) {
          alert('Tu sesión ha expirado o no tienes permisos. Por favor, cierra sesión y vuelve a entrar.');
        } else {
          alert('Hubo un problema al conectar con el servidor. Verifica que el backend esté corriendo.');
        }
      }
    });
  }
}
