import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-verify-code",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="verify-code-container">
      <div class="verify-code-card">
        <div class="verify-code-header">
          <h2>Verificación de Código</h2>
          <p>Ingresa el código de verificación que te hemos enviado por correo electrónico</p>
        </div>
        
        <div class="alert alert-danger" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        
        <div class="alert alert-success" *ngIf="successMessage">
          {{ successMessage }}
        </div>
        
        <form (ngSubmit)="onSubmit()" #verifyCodeForm="ngForm" *ngIf="!successMessage">
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
              [disabled]="emailFromRoute"
            >
            <div class="invalid-feedback" *ngIf="emailInput.invalid && (emailInput.dirty || emailInput.touched)">
              <div *ngIf="emailInput.errors?.['required']">El correo electrónico es requerido</div>
              <div *ngIf="emailInput.errors?.['email']">Ingresa un correo electrónico válido</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="code">Código de Verificación</label>
            <input 
              type="text" 
              id="code" 
              name="code" 
              [(ngModel)]="code" 
              required 
              minlength="6"
              maxlength="6"
              #codeInput="ngModel"
              [class.is-invalid]="codeInput.invalid && (codeInput.dirty || codeInput.touched)"
              placeholder="Ingresa el código de 6 dígitos"
            >
            <div class="invalid-feedback" *ngIf="codeInput.invalid && (codeInput.dirty || codeInput.touched)">
              <div *ngIf="codeInput.errors?.['required']">El código es requerido</div>
              <div *ngIf="codeInput.errors?.['minlength']">El código debe tener 6 dígitos</div>
            </div>
          </div>
          
          <button type="submit" class="btn-submit" [disabled]="verifyCodeForm.invalid || isLoading">
            <span *ngIf="!isLoading">Verificar Código</span>
            <span *ngIf="isLoading">Procesando...</span>
          </button>
        </form>
        
        <div class="verify-code-footer">
          <p>
            <a routerLink="/forgot-password">Solicitar un nuevo código</a>
          </p>
          <p>¿Recordaste tu contraseña? <a routerLink="/login">Iniciar Sesión</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .verify-code-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    
    .verify-code-card {
      background-color: var(--bg-secondary);
      border-radius: 0;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 30px;
      width: 100%;
      max-width: 400px;
    }
    
    .verify-code-header {
      margin-bottom: 25px;
      text-align: center;
    }
    
    .verify-code-header h2 {
      color: var(--text-primary);
      margin-bottom: 10px;
      font-size: 1.8rem;
    }
    
    .verify-code-header p {
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
    
    .form-group input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
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
    
    .verify-code-footer {
      margin-top: 20px;
      text-align: center;
      font-size: 0.9rem;
    }
    
    .verify-code-footer a {
      color: var(--primary-color);
      font-weight: 500;
      text-decoration: none;
    }
    
    .verify-code-footer a:hover {
      text-decoration: underline;
    }
    `
  ]
})
export class VerifyCodeComponent implements OnInit {
  email: string = '';
  code: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  emailFromRoute: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Verificar si hay un email en la URL
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
        this.emailFromRoute = true;
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (!this.email || !this.code) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }
    
    this.isLoading = true;

    this.authService.verifyCode(this.email, this.code).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Código verificado correctamente';
        this.isLoading = false;
        // Redirigir a la página de cambio de contraseña con el token
        setTimeout(() => {
          this.router.navigate(['/reset-password'], { 
            queryParams: { token: response.token }
          });
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Ha ocurrido un error al verificar el código';
        this.isLoading = false;
      }
    });
  }
}
