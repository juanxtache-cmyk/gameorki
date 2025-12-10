import { Component, OnInit, OnDestroy, Renderer2 } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ThemeService } from "../services/theme.service";
import { HeaderComponent } from "./header.component";
import { FooterComponent } from "./footer.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  template: `
    <div class="app-container" 
         [class.dark-theme]="currentTheme === 'dark'" 
         [class.retro-theme]="currentTheme === 'retro'"
         [class.grayscale-theme]="currentTheme === 'grayscale'">
      <app-header></app-header>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [
    `
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .main-content {
      flex: 1;
      padding: 20px;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
    }
    
    .app-container.dark-theme {
     background-color: #121212;
      color: #f5f5f7;
    }
    
    .app-container.retro-theme {
      background-color: #220033;
      color: #00ff99;
    }
    
    .app-container.grayscale-theme {
      background-color: #2a2a2a;
      color: #e0e0e0;
    }
    `,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "GameStore";
  currentTheme: 'retro' | 'dark' | 'grayscale' = 'dark';

  constructor(
    private themeService: ThemeService,
    private renderer: Renderer2
  ) {
    console.log("AppComponent: Constructor iniciado");
  }

  ngOnInit(): void {
    console.log("AppComponent: ngOnInit iniciado");

    this.themeService.currentTheme$.subscribe((theme) => {
      console.log(`AppComponent: Tema recibido: ${theme}`);
      this.currentTheme = theme as any;
      
      // Aplicar tema al body del documento
      this.renderer.removeClass(document.body, "dark-theme");
      this.renderer.removeClass(document.body, "retro-theme");
      this.renderer.removeClass(document.body, "grayscale-theme");
      
      if (theme === "dark") {
        this.renderer.addClass(document.body, "dark-theme");
      } else if (theme === "retro") {
        this.renderer.addClass(document.body, "retro-theme");
      } else if (theme === "grayscale") {
        this.renderer.addClass(document.body, "grayscale-theme");
      }
    });

    setTimeout(() => {
      console.log("AppComponent: Registrando estado del tema");
      this.themeService.logCurrentState();
    }, 500);

    // Inicializar cursor personalizado global
    if (!document.getElementById('custom-cursor')) {
      const cursorDiv = document.createElement('div');
      cursorDiv.id = 'custom-cursor';
      cursorDiv.innerHTML = '<img id="custom-cursor-img" src="/assets/cursor.svg" alt="cursor" />';
      document.body.appendChild(cursorDiv);
    }

    // Listener global de movimiento
    document.body.addEventListener('mousemove', this.moveCustomCursor);

    // Ocultar/mostrar cursor al salir/entrar de la ventana
    document.addEventListener('mouseleave', () => {
      const cursor = document.getElementById('custom-cursor');
      if (cursor) cursor.style.display = 'none';
    });

    document.addEventListener('mouseenter', () => {
      const cursor = document.getElementById('custom-cursor');
      if (cursor) cursor.style.display = 'block';
    });

    console.log("AppComponent: ngOnInit completado");
  }

  ngOnDestroy(): void {
    // Limpiar listeners globales
    document.body.removeEventListener('mousemove', this.moveCustomCursor);
  }

  private moveCustomCursor = (e: MouseEvent): void => {
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    }
  };
}
