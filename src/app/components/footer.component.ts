import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-grid">
          <!-- Logo y descripción -->
          <div class="footer-section">
            <div class="footer-logo">
              <h3>GameStore</h3>
              <div class="pixel-decoration"></div>
            </div>
            <p class="footer-description">
              Tu tienda de videojuegos retro y modernos. 
              Los mejores precios y la mayor selección de títulos.
            </p>
            <div class="social-links">
              <a href="#" class="social-link" title="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
              </a>
              <a href="#" class="social-link" title="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                </svg>
              </a>
              <a href="#" class="social-link" title="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                </svg>
              </a>
              <a href="#" class="social-link" title="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Enlaces rápidos -->
          <div class="footer-section">
            <h4 class="footer-title">Enlaces Rápidos</h4>
            <ul class="footer-links">
              <li><a routerLink="/games">Todos los Juegos</a></li>
              <li><a routerLink="/games?category=action">Acción</a></li>
              <li><a routerLink="/games?category=adventure">Aventura</a></li>
              <li><a routerLink="/games?category=rpg">RPG</a></li>
              <li><a routerLink="/games?category=sports">Deportes</a></li>
              <li><a routerLink="/games?category=strategy">Estrategia</a></li>
            </ul>
          </div>

          <!-- Información -->
          <div class="footer-section">
            <h4 class="footer-title">Información</h4>
            <ul class="footer-links">
              <li><a href="#about">Sobre Nosotros</a></li>
              <li><a href="#contact">Contacto</a></li>
              <li><a href="#shipping">Envíos</a></li>
              <li><a href="#returns">Devoluciones</a></li>
              <li><a href="#support">Soporte</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <!-- Mi Cuenta -->
          <div class="footer-section">
            <h4 class="footer-title">Mi Cuenta</h4>
            <ul class="footer-links">
              <li><a routerLink="/login">Iniciar Sesión</a></li>
              <li><a routerLink="/register">Registrarse</a></li>
              <li><a routerLink="/profile">Mi Perfil</a></li>
              <li><a routerLink="/cart">Mi Carrito</a></li>
              <li><a href="#orders">Mis Pedidos</a></li>
              <li><a href="#wishlist">Lista de Deseos</a></li>
            </ul>
          </div>
        </div>

        <!-- Información legal -->
        <div class="footer-bottom">
          <div class="footer-legal">
            <p>&copy; 2024 GameStore. Todos los derechos reservados.</p>
            <div class="legal-links">
              <a href="#privacy">Política de Privacidad</a>
              <a href="#terms">Términos de Uso</a>
              <a href="#cookies">Política de Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: linear-gradient(135deg, 
        var(--bg-secondary) 0%,
        rgba(0, 0, 0, 0.9) 100%);
      border-top: 4px solid var(--accent-color);
      color: var(--text-primary);
      margin-top: auto;
      position: relative;
    }

    .footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: repeating-linear-gradient(
        90deg,
        var(--accent-color) 0px,
        var(--accent-color) 10px,
        transparent 10px,
        transparent 20px
      );
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: clamp(30px, 5vw, 50px) clamp(15px, 4vw, 30px) clamp(20px, 3vw, 30px);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(clamp(200px, 25vw, 250px), 1fr));
      gap: clamp(25px, 5vw, 40px);
      margin-bottom: clamp(20px, 4vw, 30px);
    }

    .footer-section {
      display: flex;
      flex-direction: column;
    }

    .footer-logo h3 {
      color: var(--accent-color);
      font-size: clamp(1.5rem, 4vw, 2rem);
      margin: 0 0 10px 0;
      font-family: var(--pixel-font);
      text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .pixel-decoration {
      width: 60px;
      height: 4px;
      background: var(--accent-color);
      margin-bottom: 15px;
      position: relative;
    }

    .pixel-decoration::after {
      content: '';
      position: absolute;
      right: -8px;
      top: -2px;
      width: 8px;
      height: 8px;
      background: var(--accent-color);
    }

    .footer-description {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 20px;
      font-size: clamp(0.9rem, 2.5vw, 1rem);
      font-family: var(--retro-font);
    }

    .social-links {
      display: flex;
      gap: clamp(10px, 3vw, 15px);
      flex-wrap: wrap;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: clamp(40px, 8vw, 45px);
      height: clamp(40px, 8vw, 45px);
      background-color: var(--bg-tertiary);
      color: var(--text-secondary);
      border: 2px solid var(--border-color);
      transition: all 0.3s;
      text-decoration: none;
      border-radius: 0;
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
    }

    .social-link:hover {
      background-color: var(--accent-color);
      color: white;
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.5);
    }

    .footer-title {
      color: var(--heading-color);
      font-size: clamp(1rem, 3vw, 1.2rem);
      margin: 0 0 15px 0;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      letter-spacing: 1px;
      position: relative;
      padding-bottom: 8px;
    }

    .footer-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 30px;
      height: 2px;
      background: var(--accent-color);
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .footer-links li {
      position: relative;
    }

    .footer-links a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.3s;
      font-size: clamp(0.9rem, 2.5vw, 1rem);
      font-family: var(--retro-font);
      padding: 5px 0;
      display: block;
      position: relative;
      overflow: hidden;
    }

    .footer-links a::before {
      content: '▸';
      color: var(--accent-color);
      opacity: 0;
      transform: translateX(-10px);
      transition: all 0.3s;
      margin-right: 5px;
      font-family: var(--pixel-font);
    }

    .footer-links a:hover {
      color: var(--accent-color);
      padding-left: 15px;
    }

    .footer-links a:hover::before {
      opacity: 1;
      transform: translateX(0);
    }

    .footer-bottom {
      border-top: 2px solid var(--border-color);
      padding-top: clamp(15px, 3vw, 20px);
      margin-top: clamp(20px, 4vw, 30px);
    }

    .footer-legal {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
    }

    .footer-legal p {
      color: var(--text-tertiary);
      margin: 0;
      font-size: clamp(0.8rem, 2.5vw, 0.9rem);
      font-family: var(--retro-font);
    }

    .legal-links {
      display: flex;
      gap: clamp(15px, 3vw, 25px);
      flex-wrap: wrap;
    }

    .legal-links a {
      color: var(--text-tertiary);
      text-decoration: none;
      font-size: clamp(0.8rem, 2.5vw, 0.9rem);
      transition: color 0.3s;
      font-family: var(--retro-font);
    }

    .legal-links a:hover {
      color: var(--accent-color);
    }

    /* Mobile optimizations */
    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 25px;
      }
      
      .footer-section:first-child {
        grid-column: 1 / -1;
        text-align: center;
        margin-bottom: 10px;
      }

      .social-links {
        justify-content: center;
      }

      .footer-legal {
        text-align: center;
        flex-direction: column;
        gap: 10px;
      }

      .legal-links {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .footer-section {
        text-align: center;
      }

      .footer-title::after {
        left: 50%;
        transform: translateX(-50%);
      }

      .social-link {
        width: 36px;
        height: 36px;
        border-width: 1px;
        box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
      }

      .social-link:hover {
        transform: none;
        box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
      }

      .legal-links {
        flex-direction: column;
        gap: 8px;
      }
    }

    /* Touch improvements */
    @media (hover: none) and (pointer: coarse) {
      .social-link:hover {
        transform: none;
      }

      .footer-links a:hover {
        padding-left: 0;
      }

      .footer-links a:hover::before {
        opacity: 0;
        transform: translateX(-10px);
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .social-link,
      .footer-links a,
      .footer-links a::before {
        transition: none;
      }

      .social-link:hover {
        transform: none;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .footer {
        border-top-width: 6px;
      }

      .social-link,
      .footer-bottom {
        border-width: 3px;
      }
    }
  `]
})
export class FooterComponent {}
