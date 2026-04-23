import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../servicios/usuarios.service';
import { Usuarios } from '../usuario/usuario.model';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-gestor-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestor-usuarios.html',
  styleUrl: './gestor-usuarios.css'
})
export class GestorUsuarios {
  private usuariosService = inject(UsuariosService);
  public auth = inject(AuthService);

  isOpen = signal(false);
  editingUser = signal<Usuarios | null>(null);

  catalog = [
    'https://upload.wikimedia.org/wikipedia/commons/1/16/Official_Presidential_Portrait_of_President_Donald_J._Trump_%282025%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/2/21/Johnny_Depp_2020.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/9/9d/Dwayne_Johnson-1809_%28cropped%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/6/67/Westcolen2023.png',
    'https://upload.wikimedia.org/wikipedia/lt/1/16/CJ.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png' // Default/Fallback
  ];

  formData = {
    nombre: '',
    avatar: this.catalog[5]
  };

  abrirCrear() {
    this.editingUser.set(null);
    this.formData = { nombre: '', avatar: this.catalog[5] };
    this.isOpen.set(true);
  }

  abrirEditar(u: Usuarios) {
    this.editingUser.set(u);
    this.formData = { nombre: u.nombre, avatar: u.avatar };
    this.isOpen.set(true);
  }

  cerrarModal() {
    this.isOpen.set(false);
  }

  seleccionarAvatar(url: string) {
    this.formData.avatar = url;
  }

  guardar() {
    if (!this.formData.nombre || !this.formData.avatar) return;

    const current = this.editingUser();
    if (current) {
      // Edit
      this.usuariosService.editarUsuario(current.id, this.formData.nombre, this.formData.avatar)
        .subscribe(() => this.cerrarModal());
    } else {
      // Create
      const nuevoUsuario: Usuarios = {
        id: 'u_' + new Date().getTime(),
        nombre: this.formData.nombre,
        avatar: this.formData.avatar
      };
      this.usuariosService.crearUsuario(nuevoUsuario)
        .subscribe(() => this.cerrarModal());
    }
  }

  eliminar() {
    const current = this.editingUser();
    if (current && confirm(`¿Estás seguro de que deseas eliminar a ${current.nombre}? Sus tareas también serán eliminadas.`)) {
      this.usuariosService.eliminarUsuario(current.id)
        .subscribe(() => this.cerrarModal());
    }
  }
}
