import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="reset-password-container">
      <div class="reset-password-card">
        <div class="reset-password-header">
          <h2>Restablecer Contraseña</h2>
          <p>Ingresa tu nueva contraseña</p>
        </div>
        
        <div class="alert alert-danger" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        
        <div class="alert alert-success" *ngIf="successMessage">
          {{ successMessage }}
        </div>
        
        <form (ngSubmit)="onSubmit()" #resetPasswordForm="ngForm" *ngIf="!successMessage">
          <div class="form-group">
            <label for="password">Nueva Contraseña</label>
            <div class="password-input">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                name="password" 
                [(ngModel)]="newPassword" 
                required 
                minlength="6"
                #passwordInput="ngModel"
                [class.is-invalid]="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)"
              >
              <button type="button" class="toggle-password" (click)="togglePasswordVisibility()">
                <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                </svg>
                <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                  <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                </svg>
              </button>
            </div>
            <div class="invalid-feedback" *ngIf="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)">
              <div *ngIf="passwordInput.errors?.['required']">La contraseña es requerida</div>
              <div *ngIf="passwordInput.errors?.['minlength']">La contraseña debe tener al menos 6 caracteres</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña</label>
            <div class="password-input">
              <input 
                [type]="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword" 
                name="confirmPassword" 
                [(ngModel)]="confirmPassword" 
                required 
                #confirmPasswordInput="ngModel"
                [class.is-invalid]="(confirmPasswordInput.invalid && (confirmPasswordInput.dirty || confirmPasswordInput.touched)) || passwordMismatch"
              >
              <button type="button" class="toggle-password" (click)="toggleConfirmPasswordVisibility()">
                <svg *ngIf="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                </svg>
                <svg *ngIf="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                  <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                </svg>
              </button>
            </div>
            <div class="invalid-feedback" *ngIf="confirmPasswordInput.invalid && (confirmPasswordInput.dirty || confirmPasswordInput.touched)">
              La confirmación de contraseña es requerida
            </div>
            <div class="invalid-feedback" *ngIf="passwordMismatch">
              Las contraseñas no coinciden
            </div>
          </div>
          
          <button type="submit" class="btn-submit" [disabled]="resetPasswordForm.invalid || isLoading || passwordMismatch">
            <span *ngIf="!isLoading">Restablecer Contraseña</span>
            <span *ngIf="isLoading">Procesando...</span>
          </button>
        </form>
        
        <div class="reset-password-footer" *ngIf="successMessage">
          <p>Puedes <a routerLink="/login">Iniciar Sesión</a> con tu nueva contraseña</p>
        </div>
        
        <div class="reset-password-footer" *ngIf="!successMessage">
          <p>¿Recordaste tu contraseña? <a routerLink="/login">Iniciar Sesión</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .reset-password-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    
    .reset-password-card {
      background-color: var(--bg-secondary);
      border-radius: 0;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 30px;
      width: 100%;
      max-width: 400px;
    }
    
    .reset-password-header {
      margin-bottom: 25px;
      text-align: center;
    }
    
    .reset-password-header h2 {
      color: var(--text-primary);
      margin-bottom: 10px;
      font-size: 1.8rem;
    }
    
    .reset-password-header p {
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
    
    .password-input {
      position: relative;
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
    
    .toggle-password {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-secondary);
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
    
    .reset-password-footer {
      margin-top: 20px;
      text-align: center;
      font-size: 0.9rem;
    }
    
    .reset-password-footer a {
      color: var(--primary-color);
      font-weight: 500;
      text-decoration: none;
    }
    
    .reset-password-footer a:hover {
      text-decoration: underline;
    }
    `
  ]
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  passwordMismatch: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    // Intentar obtener el token de los parámetros de la ruta
    this.route.params.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
      }
    });
    
    // Si no hay token en los parámetros de la ruta, verificar en los query params
    if (!this.token) {
      this.route.queryParams.subscribe(params => {
        if (params['token']) {
          this.token = params['token'];
        }
      });
    }
    
    // Si después de verificar ambas fuentes no hay token, mostrar error
    if (!this.token) {
      this.errorMessage = 'Token no válido o expirado';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkPasswordMatch(): void {
    this.passwordMismatch = this.newPassword !== this.confirmPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    // Verificar que las contraseñas coincidan
    this.checkPasswordMatch();
    if (this.passwordMismatch) {
      return;
    }
    
    this.isLoading = true;

    if (!this.token) {
      this.errorMessage = 'Token no válido o expirado';
      this.isLoading = false;
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Contraseña restablecida exitosamente';
        this.isLoading = false;
        // Redirigir al login después de un tiempo
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Ha ocurrido un error. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }
}
