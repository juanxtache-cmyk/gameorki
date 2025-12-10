import { Component, OnInit, HostListener } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../services/auth.service";
import { CartService } from "../services/cart.service";
import { ThemeService } from "../services/theme.service";
import { User } from "../models/user.model";
import { Cart } from "../models/cart.model";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container">
        <!-- Logo -->
        <div class="logo">
          <a routerLink="/home">
            <h1>GameStore</h1>
          </a>
        </div>
        
        <!-- Mobile Menu Button -->
        <button class="mobile-menu-btn" (click)="toggleMobileMenu()" [class.active]="isMobileMenuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <!-- Navigation and User Actions Container -->
        <div class="nav-container" [class.mobile-open]="isMobileMenuOpen">
          <!-- Navigation -->
          <nav class="nav">
            <ul class="nav-list">
              <li><a routerLink="/home" routerLinkActive="active" (click)="closeMobileMenu()">Inicio</a></li>
              <li><a routerLink="/games" routerLinkActive="active" (click)="closeMobileMenu()">Juegos</a></li>
              <li class="categories">
                <a (click)="toggleCategoriesMenu()">Categorías</a>
                <div class="dropdown" [class.open]="isCategoriesOpen">
                  <a routerLink="/games" [queryParams]="{category: 'RPG'}" (click)="closeAllMenus()">RPG</a>
                  <a routerLink="/games" [queryParams]="{category: 'Acción/Aventura'}" (click)="closeAllMenus()">Acción/Aventura</a>
                  <a routerLink="/games" [queryParams]="{category: 'FPS'}" (click)="closeAllMenus()">FPS</a>
                  <a routerLink="/games" [queryParams]="{category: 'Deportes'}" (click)="closeAllMenus()">Deportes</a>
                </div>
              </li>
            </ul>
          </nav>
          
          <!-- User Actions -->
          <div class="user-actions">
            <!-- Search -->
            <div class="search">
              <input type="text" placeholder="Buscar juegos...">
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </button>
            </div>
            
            <!-- Cart -->
            <div class="cart">
              <a routerLink="/cart" class="cart-icon" (click)="closeMobileMenu()">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <span class="cart-count" *ngIf="cart.totalItems > 0">{{ cart.totalItems }}</span>
              </a>
            </div>

            <!-- Theme Selector -->
            <div class="theme-selector">
              <div class="theme-dropdown">
                <button class="theme-selector-btn" (click)="toggleThemeMenu()" aria-label="Seleccionar tema">
                  <span class="theme-icon">{{ getCurrentThemeIcon() }}</span>
                  <span class="theme-name">{{ getCurrentThemeName() }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 12.5a.5.5 0 0 1-.354-.146l-5-5a.5.5 0 1 1 .708-.708L8 11.293l4.646-4.647a.5.5 0 1 1 .708.708l-5 5a.5.5 0 0 1-.354.146z"/>
                  </svg>
                </button>
                <div class="theme-dropdown-menu" [class.open]="isThemeMenuOpen">
                  <button 
                    *ngFor="let theme of themes" 
                    (click)="onThemeSelect(theme.key)"
                    class="theme-option"
                    [class.active]="currentTheme === theme.key">
                    <span>{{ theme.icon }}</span>
                    <span>{{ theme.name }}</span>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Auth Buttons -->
            <div class="auth-buttons" *ngIf="!currentUser">
              <a routerLink="/login" class="btn btn-login" (click)="closeMobileMenu()">Iniciar Sesión</a>
              <a routerLink="/register" class="btn btn-register" (click)="closeMobileMenu()">Registrarse</a>
            </div>
            
            <!-- User Menu -->
            <div class="user-menu" *ngIf="currentUser">
              <div class="user-info" (click)="toggleUserMenu()">
                <span class="user-greeting">Hola, {{ currentUser.username || currentUser.username }}</span>
                <div class="dropdown" [class.open]="isUserMenuOpen">
                  <a routerLink="/profile" (click)="closeAllMenus()">Mi Perfil</a>
                  <a routerLink="/settings" (click)="closeAllMenus()">⚙️Configuración</a>
                  <a routerLink="/purchase-history" (click)="closeAllMenus()">📋 Mis Compras</a>
                  <a routerLink="/admin" (click)="closeAllMenus()" *ngIf="isAdmin()" class="admin-link">Administración</a>
                  <a (click)="logout()" class="logout">Cerrar Sesión</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
    .header {
      background-color: var(--header-bg);
      color: var(--header-text);
      padding: 15px 0;
      box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
      border-bottom: 3px solid var(--border-color);
      position: relative;
      z-index: 10;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      position: relative;
    }
    
    .logo a {
      text-decoration: none;
      color: white;
    }
    
    .logo h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: var(--accent-color);
      font-family: var(--pixel-font);
      text-transform: uppercase;
      letter-spacing: -1px;
      text-shadow: 3px 3px 0 rgba(0,0,0,0.5);
    }

    /* Mobile Menu Button */
    .mobile-menu-btn {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      z-index: 1001;
    }

    .mobile-menu-btn span {
      width: 25px;
      height: 3px;
      background-color: var(--header-text);
      transition: all 0.3s ease;
      transform-origin: center;
    }

    .mobile-menu-btn.active span:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }

    .mobile-menu-btn.active span:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-btn.active span:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }

    /* Navigation Container */
    .nav-container {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .nav-list li {
      margin: 0 15px;
      position: relative;
    }
    
    .nav-list a {
      color: var(--header-text);
      text-decoration: none;
      font-size: 16px;
      transition: color 0.3s;
      cursor: pointer;
      font-family: var(--pixel-font);
      font-size: 0.8rem;
      text-transform: uppercase;
      text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
    }
    
    .nav-list a:hover, .nav-list a.active {
      color: var(--accent-color);
      text-shadow: 0 0 5px var(--accent-color);
    }
    
    .dropdown {
      display: none;
      position: absolute;
      background-color: var(--bg-secondary);
      min-width: 160px;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
      z-index: 1000;
      border-radius: 0;
      padding: 10px 0;
      margin-top: 10px;
      border: 3px solid var(--border-color);
    }
    
    .dropdown.open {
      display: block;
    }
    
    .dropdown a {
      display: block;
      padding: 8px 15px;
      color: var(--text-primary);
      text-decoration: none;
    }
    
    .dropdown a:hover {
      background-color: var(--bg-tertiary);
      color: var(--accent-color);
    }
    
    .user-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .search {
      display: flex;
      position: relative;
    }
    
    .search input {
      padding: 8px 15px;
      border: 3px solid var(--border-color);
      background-color: var(--input-bg);
      color: var(--text-primary);
      width: 200px;
      font-family: var(--retro-font);
      font-size: 1rem;
    }
    
    .search button {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--accent-color);
      cursor: pointer;
      box-shadow: none;
    }
    
    .search button:hover {
      transform: translateY(-50%) scale(1.1);
      text-shadow: 0 0 5px var(--accent-color);
    }
    
    .cart {
      position: relative;
    }
    
    .cart-icon {
      color: var(--header-text);
      position: relative;
      display: inline-block;
    }
    
    .cart-count {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: var(--accent-color);
      color: white;
      border-radius: 0;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      border: 2px solid var(--border-color);
      font-family: var(--pixel-font);
    }

    .theme-selector {
      position: relative;
    }
    
    .theme-dropdown {
      position: relative;
    }
    
    .theme-selector-btn {
      background: none;
      border: 2px solid var(--border-color);
      color: var(--header-text);
      cursor: pointer;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: 0;
      transition: all 0.3s;
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
      font-family: var(--pixel-font);
      font-size: 10px;
      text-transform: uppercase;
    }
    
    .theme-selector-btn:hover {
      background-color: var(--bg-tertiary);
      transform: translate(-2px, -2px);
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
    }

    .theme-dropdown-menu {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      background-color: var(--bg-secondary);
      border: 3px solid var(--border-color);
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
      z-index: 1000;
      margin-top: 5px;
      min-width: 150px;
    }

    .theme-dropdown-menu.open {
      display: block;
    }

    .theme-option {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 10px 12px;
      border: none;
      background: none;
      color: var(--text-primary);
      cursor: pointer;
      font-family: var(--pixel-font);
      font-size: 10px;
      text-transform: uppercase;
      transition: all 0.2s;
      border-bottom: 1px solid var(--border-color);
    }

    .theme-option:last-child {
      border-bottom: none;
    }

    .theme-option:hover {
      background-color: var(--bg-tertiary);
      color: var(--accent-color);
    }

    .theme-option.active {
      background-color: var(--accent-color);
      color: white;
    }
    
    .btn {
      padding: 8px 15px;
      border-radius: 0;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
      font-family: var(--pixel-font);
      font-size: 0.7rem;
      text-transform: uppercase;
      border: 2px solid var(--border-color);
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
      white-space: nowrap;
    }
    
    .btn-login {
      color: var(--header-text);
      background-color: transparent;
    }
    
    .btn-register {
      background-color: var(--accent-color);
      color: white;
    }
    
    .btn-register:hover, .btn-login:hover {
      transform: translate(-2px, -2px);
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
    }
    
    .user-info {
      position: relative;
      cursor: pointer;
    }

    .user-greeting {
      font-family: var(--pixel-font);
      font-size: 0.8rem;
      text-transform: uppercase;
    }
    
    .user-info .dropdown {
      right: 0;
      left: auto;
    }
    
    .logout {
      cursor: pointer;
      color: var(--accent-color) !important;
    }

    .admin-link {
      color: #ff6600 !important;
      font-weight: bold;
      font-family: var(--pixel-font);
    }

    .admin-link:hover {
      color: #ff9900 !important;
      text-shadow: 0 0 5px #ff6600;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .search input {
        width: 150px;
      }
      
      .theme-selector-btn .theme-name {
        display: none;
      }
      
      .btn {
        font-size: 0.6rem;
        padding: 6px 12px;
      }
    }

    @media (max-width: 768px) {
      .mobile-menu-btn {
        display: flex;
      }
      
      .nav-container {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: var(--header-bg);
        flex-direction: column;
        align-items: stretch;
        gap: 0;
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        border-top: 3px solid var(--border-color);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      }
      
      .nav-container.mobile-open {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }
      
      .nav {
        width: 100%;
        border-bottom: 2px solid var(--border-color);
        padding: 20px 0;
      }
      
      .nav-list {
        flex-direction: column;
        gap: 15px;
        padding: 0 20px;
      }
      
      .nav-list li {
        margin: 0;
      }
      
      .user-actions {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
        padding: 20px;
      }
      
      .search {
        order: 1;
      }
      
      .search input {
        width: 100%;
      }
      
      .cart, .theme-selector {
        order: 2;
        align-self: center;
      }
      
      .auth-buttons, .user-menu {
        order: 3;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .auth-buttons {
        align-items: stretch;
      }
      
      .btn {
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 0 15px;
      }
      
      .logo h1 {
        font-size: 20px;
      }
      
      .search input {
        font-size: 14px;
        padding: 6px 12px;
      }
      
      .btn {
        font-size: 0.6rem;
        padding: 8px 12px;
      }
      
      .dropdown {
        left: 0;
        right: 0;
        min-width: auto;
      }
      
      .theme-dropdown-menu {
        left: 0;
        right: 0;
        min-width: auto;
      }
    }
    `
  ]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  cart: Cart = { items: [], totalItems: 0, totalPrice: 0 };
  currentTheme: 'dark' | 'retro' | 'grayscale' = 'dark';
  themes = [
    { key: 'retro', name: 'Retro', icon: '👾' },
    { key: 'dark', name: 'Dark', icon: '🌙' },
    { key: 'grayscale', name: 'Grayscale', icon: '⚫' }
  ];
  
  // Estados para controlar los menús desplegables
  isCategoriesOpen = false;
  isThemeMenuOpen = false;
  isUserMenuOpen = false;
  isMobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
    });

    this.themeService.currentTheme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  setTheme(theme: 'retro' | 'dark' | 'grayscale'): void {
    this.themeService.setTheme(theme);
  }

  onThemeSelect(themeKey: string): void {
    if ( themeKey === 'retro' || themeKey === 'dark' || themeKey === 'grayscale') {
      this.setTheme(themeKey);
      this.isThemeMenuOpen = false; // Cerrar menú después de seleccionar
    }
  }

  getCurrentThemeIcon(): string {
    const theme = this.themes.find(t => t.key === this.currentTheme);
    return theme ? theme.icon : '🌆';
  }

  getCurrentThemeName(): string {
    const theme = this.themes.find(t => t.key === this.currentTheme);
    return theme ? theme.name : 'Cyberpunk';
  }

  // Métodos para controlar menús desplegables
  toggleCategoriesMenu(): void {
    this.isCategoriesOpen = !this.isCategoriesOpen;
    this.closeOtherMenus('categories');
  }

  toggleThemeMenu(): void {
    this.isThemeMenuOpen = !this.isThemeMenuOpen;
    this.closeOtherMenus('theme');
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.closeOtherMenus('user');
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      // Cerrar otros menús cuando se abre el mobile menu
      this.closeAllMenus();
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.closeAllMenus();
  }

  closeOtherMenus(except: string): void {
    if (except !== 'categories') this.isCategoriesOpen = false;
    if (except !== 'theme') this.isThemeMenuOpen = false;
    if (except !== 'user') this.isUserMenuOpen = false;
  }

  closeAllMenus(): void {
    this.isCategoriesOpen = false;
    this.isThemeMenuOpen = false;
    this.isUserMenuOpen = false;
  }

  // Listener para cerrar menús al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.theme-dropdown') && 
        !target.closest('.categories') && 
        !target.closest('.user-info') &&
        !target.closest('.mobile-menu-btn') &&
        !target.closest('.nav-container')) {
      this.closeAllMenus();
      // No cerrar el menú móvil si se hace clic dentro de él
      if (!target.closest('.nav-container')) {
        this.isMobileMenuOpen = false;
      }
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
    this.closeAllMenus();
    this.closeMobileMenu();
  }
}