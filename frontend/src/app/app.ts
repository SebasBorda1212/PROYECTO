import { Component, signal, inject, ViewChild } from '@angular/core';
import { Encabezado } from "./componentes/encabezado/encabezado";
import { Usuario } from './componentes/usuario/usuario';
import { Tareas } from './componentes/tareas/tareas';
import { UsuariosService } from './servicios/usuarios.service';
import { GestorUsuarios } from './componentes/gestor-usuarios/gestor-usuarios';
import { GestorAdmins } from './componentes/gestor-admins/gestor-admins';
import { AuthService } from './servicios/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Encabezado, Usuario, Tareas, GestorUsuarios, GestorAdmins],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto_inicial');
  private usuariosService = inject(UsuariosService);
  public auth = inject(AuthService); // Añadido para controlar visibilidad de roles
  
  @ViewChild(GestorUsuarios) gestorUsuarios!: GestorUsuarios;

  // Control de secciones administrativas
  seccionActiva: 'ninguna' | 'usuarios' | 'admins' = 'ninguna';

  toggleUsuarios() {
    this.seccionActiva = this.seccionActiva === 'usuarios' ? 'ninguna' : 'usuarios';
  }

  toggleAdmins() {
    this.seccionActiva = this.seccionActiva === 'admins' ? 'ninguna' : 'admins';
  }

  get usuarios() {
    return this.usuariosService.usuarios();
  }

  idUsuarioSeleccionado?: string;
  
  get usuarioSeleccionado() {
    return this.usuarios.find((usuario) => usuario.id === this.idUsuarioSeleccionado);
  }

  alSeleccionarUsuario(id: string) {
    this.idUsuarioSeleccionado = id;
  }

  resetSelection() {
    this.idUsuarioSeleccionado = undefined;
  }
}
