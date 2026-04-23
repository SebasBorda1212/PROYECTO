import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminsService } from '../../servicios/admins.service';

@Component({
  selector: 'app-gestor-admins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestor-admins.html',
  styleUrl: './gestor-admins.css'
})
export class GestorAdmins implements OnInit {
  private adminsService = inject(AdminsService);
  
  admins = this.adminsService.admins;
  showModal = signal(false);
  
  nuevoAdmin = {
    username: '',
    password: ''
  };

  ngOnInit() {
    this.adminsService.cargarAdmins();
  }

  abrirModal() {
    this.nuevoAdmin = { username: '', password: '' };
    this.showModal.set(true);
  }

  cerrarModal() {
    this.showModal.set(false);
  }

  guardarAdmin() {
    if (!this.nuevoAdmin.username || !this.nuevoAdmin.password) return;
    
    this.adminsService.crearAdmin(this.nuevoAdmin).subscribe({
      next: () => this.cerrarModal(),
      error: (err) => alert(err.error?.mensaje || 'Error al crear admin')
    });
  }

  eliminarAdmin(id: number, username: string) {
    if (confirm(`¿Estás seguro de eliminar al administrador "${username}"?`)) {
      this.adminsService.eliminarAdmin(id).subscribe({
        error: (err) => alert('Error al eliminar admin')
      });
    }
  }
}
