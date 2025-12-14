import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="forgot-password-container">
      <div class="forgot-password-card">      <div class="forgot-password-header">
          <h2>Recuperar Contraseña</h2>
          <p>Ingresa tu correo electrónico para recibir un código de verificación</p>
        </div>
        
        <div class="alert alert-danger" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        
        <div class="alert alert-success" *ngIf="successMessage">
          {{ successMessage }}
        </div>
        
        <form (ngSubmit)="onSubmit()" #forgotPasswordForm="ngForm">
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="email" 
              required 
              email
              #emailInput="ngModel"
              [class.is-invalid]="emailInput.invalid && (emailInput.dirty || emailInput.touched)"
            >
            <div class="invalid-feedback" *ngIf="emailInput.invalid && (emailInput.dirty || emailInput.touched)">
              <div *ngIf="emailInput.errors?.['required']">El correo electrónico es requerido</div>
              <div *ngIf="emailInput.errors?.['email']">Ingresa un correo electrónico válido</div>
            </div>
          </div>
          
          <button type="submit" class="btn-submit" [disabled]="forgotPasswordForm.invalid || isLoading">
            <span *ngIf="!isLoading">Enviar Código</span>
            <span *ngIf="isLoading">Enviando...</span>
          </button>
        </form>
        
        <div class="forgot-password-footer">
          <p>¿Recordaste tu contraseña? <a routerLink="/login">Iniciar Sesión</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .forgot-password-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    
    .forgot-password-card {
      background-color: var(--bg-secondary);
      border-radius: 0;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 30px;
      width: 100%;
      max-width: 400px;
    }
    
    .forgot-password-header {
      margin-bottom: 25px;
      text-align: center;
    }
    
    .forgot-password-header h2 {
      color: var(--text-primary);
      margin-bottom: 10px;
      font-size: 1.8rem;
    }
    
    .forgot-password-header p {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    
    .alert {
      padding: 12px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    
    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    
    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: var(--text-primary);
      font-weight: 500;
    }
    
    .form-group input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
      background-color: var(--input-bg);
      color: var(--text-primary);
    }
    
    .form-group input:focus {
      border-color: var(--primary-color);
      outline: none;
    }
    
    .invalid-feedback {
      color: #dc3545;
      font-size: 0.8rem;
      margin-top: 5px;
    }
    
    .is-invalid {
      border-color: #dc3545 !important;
    }
    
    .btn-submit {
      display: block;
      width: 100%;
      padding: 12px;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-submit:hover:not(:disabled) {
      background-color: var(--primary-dark);
    }
    
    .btn-submit:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    
    .forgot-password-footer {
      margin-top: 20px;
      text-align: center;
      font-size: 0.9rem;
    }
    
    .forgot-password-footer a {
      color: var(--primary-color);
      font-weight: 500;
      text-decoration: none;
    }
    
    .forgot-password-footer a:hover {
      text-decoration: underline;
    }
    `
  ]
})
export class ForgotPasswordComponent {
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (!this.email) {
      this.errorMessage = 'Por favor, ingresa tu correo electrónico';
      this.isLoading = false;
      return;
    }

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Si el correo está registrado, recibirás un código de verificación para restablecer tu contraseña.';
        
        // Si estamos en desarrollo y tenemos un token de respuesta,
        // permitimos seguir al siguiente paso directamente sin verificar el correo
        if (response.token && this.isDevMode()) {
          setTimeout(() => {
            this.router.navigate(['/verify-code'], { 
              queryParams: { email: this.email }
            });
          }, 3000);
        }
        
        // Mostrar información adicional sobre la configuración de correo en desarrollo/pruebas
        // En producción, esto debería ser eliminado
        if (this.isDevMode()) {
          setTimeout(() => {
            this.successMessage += '\n\nNota: Si estás en un entorno de desarrollo y el sistema de correos no está configurado correctamente, ' +
              'es posible que no recibas el correo. Verifica la configuración de correo en el archivo .env del backend.';
          }, 3000);
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        // Por seguridad, no mostramos errores específicos
        this.successMessage = 'Si el correo está registrado, recibirás un código de verificación para restablecer tu contraseña.';
        console.error('Error en solicitud de recuperación:', error);
        this.isLoading = false;
      }
    });
  }
  
  // Método para verificar si estamos en modo desarrollo
  private isDevMode(): boolean {
  return !environment.production;
}

}
