import { Component, EventEmitter, Output, inject, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-ajustes-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajustes-admin.html',
  styleUrl: './ajustes-admin.css'
})
export class AjustesAdmin implements OnInit {
  @Input() startTab: 'perfil' | 'nuevo' = 'perfil';
  @Output() close = new EventEmitter<void>();
  
  tab: 'perfil' | 'nuevo' = 'perfil';
  
  // Perfil
  perfilUser = '';
  perfilPass = '';
  
  // Nuevo Admin
  nuevoUser = '';
  nuevoPass = '';

  private authService = inject(AuthService);

  ngOnInit() {
    this.tab = this.startTab;
    this.authService.username$.pipe(take(1)).subscribe(name => {
      this.perfilUser = name || '';
    });
  }

  alCerrar() {
    this.close.emit();
  }

  actualizarPerfil() {
    if (!this.perfilUser) return alert('El usuario no puede estar vacío');
    
    this.authService.actualizarPerfil(this.perfilUser, this.perfilPass || undefined).subscribe({
      next: () => {
        alert('Perfil actualizado con éxito');
        this.alCerrar();
      },
      error: (err) => alert('Error al actualizar: ' + (err.error?.mensaje || 'Error desconocido'))
    });
  }

  crearAdmin() {
    if (!this.nuevoUser || !this.nuevoPass) return alert('Completa todos los campos');
    
    this.authService.registrarAdmin(this.nuevoUser, this.nuevoPass).subscribe({
      next: () => {
        alert('Nuevo administrador registrado');
        this.nuevoUser = '';
        this.nuevoPass = '';
        this.tab = 'perfil';
      },
      error: (err) => alert('Error al registrar: ' + (err.error?.mensaje || 'Error desconocido'))
    });
  }
}
