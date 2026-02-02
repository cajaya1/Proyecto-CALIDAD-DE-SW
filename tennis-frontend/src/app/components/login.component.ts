import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { LoginRequest } from '../models/product.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-10 col-md-8 col-lg-6">
          <div class="card shadow">
            <div class="card-header bg-primary text-white text-center">
              <h3>Iniciar Sesión</h3>
            </div>
            <div class="card-body p-4">
              <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
                <div class="mb-3">
                  <label for="username" class="form-label">Usuario</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="username" 
                    name="username"
                    [(ngModel)]="credentials.username" 
                    required
                    #username="ngModel"
                  >
                  <div *ngIf="username.invalid && username.touched" class="text-danger">
                    El usuario es requerido
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    name="password"
                    [(ngModel)]="credentials.password" 
                    required
                    #password="ngModel"
                  >
                  <div *ngIf="password.invalid && password.touched" class="text-danger">
                    La contraseña es requerida
                  </div>
                </div>

                <div class="alert alert-danger" *ngIf="errorMessage">
                  {{ errorMessage }}
                </div>

                <div class="d-grid">
                  <button 
                    type="submit" 
                    class="btn btn-primary" 
                    [disabled]="loginForm.invalid || isLoading"
                  >
                    {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                  </button>
                </div>
              </form>

              <div class="text-center mt-3">
                <p>¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 10px;
    }

    .card-header {
      padding: 1.5rem;
    }

    .card-header h3 {
      margin: 0;
      font-weight: 600;
    }

    .form-control {
      padding: 0.75rem;
    }

    .btn-primary {
      padding: 0.75rem;
      font-weight: 500;
    }

    .alert-danger {
      margin-bottom: 1rem;
    }
  `]
})
export class LoginComponent {
  credentials: LoginRequest = {
    username: '',
    password: ''
  };
  
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onSubmit() {
    if (this.credentials.username && this.credentials.password) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.authService.login(this.credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.notificationService.loginSuccess(response.user?.username || this.credentials.username);
          
          // Redirigir al panel de admin si el usuario es Admin
          if (response.user?.username === 'Admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          
          // Mapear correctamente códigos del backend: 400 = credenciales inválidas
          if (error.status === 400 || error.status === 401) {
            this.notificationService.invalidCredentials();
            this.errorMessage = error.error?.message || 'Credenciales inválidas';
          } else if (error.status === 0) {
            this.notificationService.networkError();
            this.errorMessage = 'Sin conexión con el servidor';
          } else {
            this.notificationService.serverError();
            this.errorMessage = error.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
          }
          
          this.isLoading = false;
        }
      });
    } else {
      this.notificationService.showWarning('Por favor completa todos los campos', 'Campos Requeridos');
    }
  }
}
