import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { LoginComponent } from '../login/login.component';
import { AjustesAdmin } from '../ajustes-admin/ajustes-admin';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [CommonModule, LoginComponent, AjustesAdmin],
  templateUrl: './encabezado.html',
  styleUrl: './encabezado.css',
})
export class Encabezado {
  @Output() logoClick = new EventEmitter<void>();
  isLoginModalOpen = false;
  activeSettingsTab: 'perfil' | 'nuevo' | null = null;

  constructor(public authService: AuthService) {}

  onLogoClick() {
    this.logoClick.emit();
  }

  openLogin() {
    this.isLoginModalOpen = true;
  }

  closeLogin() {
    this.isLoginModalOpen = false;
  }

  openSettings(tab: 'perfil' | 'nuevo') {
    this.activeSettingsTab = tab;
  }

  closeSettings() {
    this.activeSettingsTab = null;
  }

  logout() {
    this.authService.logout();
  }
}
