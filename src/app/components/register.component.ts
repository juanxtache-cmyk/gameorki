import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink, Router } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../services/auth.service"
import type { User } from "../models/user.model"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h2>Crear Cuenta</h2>
          <p>Únete a GameStore y disfruta de los mejores juegos digitales</p>
        </div>
        
        <div class="alert alert-danger" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Nombre</label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName" 
                [(ngModel)]="userData.firstName" 
                required 
                #firstName="ngModel"
                [class.is-invalid]="firstName.invalid && (firstName.dirty || firstName.touched)"
              >
              <div class="invalid-feedback" *ngIf="firstName.invalid && (firstName.dirty || firstName.touched)">
                Nombre es requerido
              </div>
            </div>
            
            <div class="form-group">
              <label for="lastName">Apellido</label>
              <input 
                type="text" 
                id="lastName" 
                name="lastName" 
                [(ngModel)]="userData.lastName" 
                required 
                #lastName="ngModel"
                [class.is-invalid]="lastName.invalid && (lastName.dirty || lastName.touched)"
              >
              <div class="invalid-feedback" *ngIf="lastName.invalid && (lastName.dirty || lastName.touched)">
                Apellido es requerido
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="username">Nombre de Usuario</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              [(ngModel)]="userData.username" 
              required 
              minlength="4"
              #username="ngModel"
              [class.is-invalid]="username.invalid && (username.dirty || username.touched)"
            >
            <div class="invalid-feedback" *ngIf="username.invalid && (username.dirty || username.touched)">
              <span *ngIf="username.errors?.['required']">Nombre de usuario es requerido</span>
              <span *ngIf="username.errors?.['minlength']">Nombre de usuario debe tener al menos 4 caracteres</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="userData.email" 
              required 
              email
              #email="ngModel"
              [class.is-invalid]="email.invalid && (email.dirty || email.touched)"
            >
            <div class="invalid-feedback" *ngIf="email.invalid && (email.dirty || email.touched)">
              <span *ngIf="email.errors?.['required']">Correo electrónico es requerido</span>
              <span *ngIf="email.errors?.['email']">Ingresa un correo electrónico válido</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="password-input">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                name="password" 
                [(ngModel)]="userData.password" 
                required 
                minlength="6"
                #password="ngModel"
                [class.is-invalid]="password.invalid && (password.dirty || password.touched)"
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
            <div class="invalid-feedback" *ngIf="password.invalid && (password.dirty || password.touched)">
              <span *ngIf="password.errors?.['required']">Contraseña es requerida</span>
              <span *ngIf="password.errors?.['minlength']">Contraseña debe tener al menos 6 caracteres</span>
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
                #confirmPasswordField="ngModel"
                [class.is-invalid]="(confirmPasswordField.invalid && (confirmPasswordField.dirty || confirmPasswordField.touched)) || passwordMismatch"
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
            <div class="invalid-feedback" *ngIf="(confirmPasswordField.invalid && (confirmPasswordField.dirty || confirmPasswordField.touched)) || passwordMismatch">
              <span *ngIf="confirmPasswordField.errors?.['required']">Confirmar contraseña es requerido</span>
              <span *ngIf="passwordMismatch">Las contraseñas no coinciden</span>
            </div>
          </div>
          
          <div class="form-group terms">
            <input 
              type="checkbox" 
              id="terms" 
              name="terms" 
              [(ngModel)]="userData.terms" 
              required 
              #terms="ngModel"
              [class.is-invalid]="terms.invalid && (terms.dirty || terms.touched)"
            >
            <label for="terms">Acepto los <a routerLink="/terms">Términos y Condiciones</a> y la <a routerLink="/privacy">Política de Privacidad</a></label>
            <div class="invalid-feedback" *ngIf="terms.invalid && (terms.dirty || terms.touched)">
              Debes aceptar los términos y condiciones
            </div>
          </div>
          
          <button type="submit" class="btn-register" [disabled]="registerForm.invalid || isLoading || passwordMismatch">
            <span *ngIf="!isLoading">Crear Cuenta</span>
            <span *ngIf="isLoading">Cargando...</span>
          </button>
        </form>
        
        <div class="register-footer">
          <p>¿Ya tienes una cuenta? <a routerLink="/login">Iniciar Sesión</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    
    .register-card {
      background-color: var(--bg-secondary);
      border-radius: 0;
      box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 550px;
      padding: 30px;
      border: 3px solid var(--border-color);
      position: relative;
    }
    
    .register-card::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        45deg,
        rgba(0, 0, 0, 0.05),
        rgba(0, 0, 0, 0.05) 10px,
        transparent 10px,
        transparent 20px
      );
      pointer-events: none;
      z-index: 0;
    }
    
    .register-header {
      text-align: center;
      margin-bottom: 30px;
      position: relative;
      z-index: 1;
    }
    
    .register-header h2 {
      color: var(--heading-color);
      margin-bottom: 10px;
      font-size: 1.8rem;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      text-shadow: 3px 3px 0 rgba(0,0,0,0.5);
    }
    
    .register-header p {
      color: var(--text-secondary);
      font-family: var(--retro-font);
      font-size: 1.2rem;
    }
    
    .alert {
      padding: 12px;
      border-radius: 0;
      margin-bottom: 20px;
      border: 2px solid var(--border-color);
      position: relative;
      z-index: 1;
    }
    
    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 2px solid #f5c6cb;
    }
    
    .form-row {
      display: flex;
      gap: 15px;
      margin-bottom: 0;
      position: relative;
      z-index: 1;
    }
    
    .form-row .form-group {
      flex: 1;
    }
    
    .form-group {
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      color: var(--text-primary);
      font-weight: 500;
      font-family: var(--pixel-font);
      font-size: 0.8rem;
      text-transform: uppercase;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
    }
    
    input[type="text"],
    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 12px 15px;
      border: 3px solid var(--border-color);
      border-radius: 0;
      font-size: 1rem;
      transition: border-color 0.3s;
      background-color: var(--input-bg);
      color: var(--text-primary);
      font-family: var(--retro-font);
    }
    
    input:focus {
      outline: none;
      box-shadow: 0 0 0 3px var(--accent-color);
    }
    
    .is-invalid {
      border-color: #dc3545 !important;
    }
    
    .invalid-feedback {
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: 5px;
      font-family: var(--retro-font);
    }
    
    .password-input {
      position: relative;
    }
    
    .toggle-password {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      box-shadow: none;
    }
    
    .toggle-password:hover {
      color: var(--accent-color);
    }
    
    .terms {
      display: flex;
      align-items: flex-start;
    }
    
    .terms input {
      margin-right: 10px;
      margin-top: 5px;
    }
    
    .terms a {
      color: var(--accent-color);
      text-decoration: none;
      font-family: var(--retro-font);
    }
    
    .terms a:hover {
      text-decoration: underline;
      text-shadow: 0 0 5px var(--accent-color);
    }
    
    .btn-register {
      width: 100%;
      padding: 12px;
      background-color: var(--accent-color);
      color: white;
      border: 3px solid var(--border-color);
      border-radius: 0;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
      position: relative;
      z-index: 1;
    }
    
    .btn-register:hover {
      background-color: var(--accent-hover);
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
    }
    
    .btn-register:disabled {
      background-color: #e9798e;
      cursor: not-allowed;
      transform: none;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
    }
    
    .register-footer {
      text-align: center;
      margin-top: 25px;
      color: var(--text-secondary);
      position: relative;
      z-index: 1;
      font-family: var(--retro-font);
      font-size: 1.1rem;
    }
    
    .register-footer a {
      color: var(--accent-color);
      text-decoration: none;
      font-weight: 500;
    }
    
    .register-footer a:hover {
      text-decoration: underline;
      text-shadow: 0 0 5px var(--accent-color);
    }
    
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `,
  ],
})
export class RegisterComponent {
  userData: User & { terms: boolean } = {
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    terms: false,
  }

  confirmPassword = ""
  isLoading = false
  errorMessage = ""
  showPassword = false
  showConfirmPassword = false

  get passwordMismatch(): boolean {
    return this.userData.password !== this.confirmPassword && this.confirmPassword !== ""
  }

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword
  }

  onSubmit(): void {
    if (this.passwordMismatch) {
      return
    }

    this.isLoading = true
    this.errorMessage = ""

    this.authService.register(this.userData).subscribe({
      next: (success) => {
        this.isLoading = false
        if (success) {
          this.router.navigate(["/login"])
        }
      },
      error: (error) => {
        this.isLoading = false
        this.errorMessage = "Ocurrió un error al registrarse. Inténtalo de nuevo."
        console.error("Error de registro:", error)
      },
    })
  }
}
