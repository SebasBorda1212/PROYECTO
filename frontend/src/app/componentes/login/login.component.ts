import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isLoading = false;

  @Output() close = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.error = '';
    this.isLoading = true;
    
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.close.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.mensaje || 'Error al iniciar sesión';
      }
    });
  }

  onClose() {
    this.close.emit();
  }
}
