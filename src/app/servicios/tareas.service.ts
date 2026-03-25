import { Injectable } from '@angular/core';
import { NuevaTareaInfo } from '../tarea/tarea.model';

@Injectable({
  providedIn: 'root',
})
export class TareasService {
  
  private tareas = [
    {
      id: 't1',
      idUsuario: 'u1',
      titulo: 'Lanzar misión tripulada a Marte',
      resumen: 'Supervisar las últimas pruebas del motor Raptor en Starbase y confirmar la ventana de lanzamiento.',
      expira: '2027-05-04'
    },
    {
      id: 't2',
      idUsuario: 'u2',
      titulo: 'Anunciar nuevo álbum',
      resumen: 'Terminar de grabar los "Vault Tracks" en el estudio y preparar los easter eggs para el video musical.',
      expira: '2025-11-13',
    },
    {
      id: 't3',
      idUsuario: 'u3',
      titulo: 'Entrenamiento de tiros libres',
      resumen: 'Practicar 100 tiros libres al ángulo y repasar la táctica de juego con el equipo.',
      expira: '2025-07-15',
    },
    {
      id: 't4',
      idUsuario: 'u4',
      titulo: 'Comprobar la Relatividad General',
      resumen: 'Analizar los datos de las nuevas observaciones astronómicas sobre la curvatura del espacio-tiempo.',
      expira: '2025-03-14',
    },
  ];

  
  obtenerTareasDeUsuario(idUsuario: string) {
    return this.tareas.filter((tarea) => tarea.idUsuario === idUsuario);
  }

  agregarTarea(infoDeTarea: NuevaTareaInfo, idUsuario:string) {
    this.tareas.unshift({
      id: new Date().getTime().toString(),
      titulo: infoDeTarea.titulo,
      resumen: infoDeTarea.resumen,
      expira: infoDeTarea.fecha,
      idUsuario: idUsuario
    });
  
  }

  eliminarTarea(id: string) {
    this.tareas = this.tareas.filter((tarea) => tarea.id !== id)
  
  }
}
