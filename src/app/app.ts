import { Component, signal } from '@angular/core';
import { Encabezado } from "./componentes/encabezado/encabezado";
import { Usuario } from './componentes/usuario/usuario';
import { USUARIOS_FALSOS } from './usuarios-falsos';
import { Tareas } from './componentes/tareas/tareas';



@Component({
  selector: 'app-root',
  imports: [Encabezado,Usuario,Tareas],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto_inicial');
  usuarios = USUARIOS_FALSOS;
  idUsuarioSeleccionado?: string;
  
  get usuarioSeleccionado() {
    return this.usuarios.find((usuario) => usuario.id === this.idUsuarioSeleccionado);
  }

  alSeleccionarUsuario(id: string) {
    this.idUsuarioSeleccionado = id;
    
  }
}
