import { Component, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextSizeService {
  private currentSize: number = 16; // Tamaño base en px
  private minSize: number = 12;
  private maxSize: number = 24;

  constructor() {
    // Cargar el tamaño guardado del localStorage
    const savedSize = localStorage.getItem('textSize');
    if (savedSize) {
      this.currentSize = parseInt(savedSize, 10);
    }
    this.applyTextSize();
    
    // Aplicar estilos cuando el DOM esté completamente cargado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.applyTextSize());
    }
  }

  getCurrentSize(): number {
    return this.currentSize;
  }

  increaseSize(): void {
    if (this.currentSize < this.maxSize) {
      this.currentSize += 2;
      this.saveAndApplySize();
    }
  }

  decreaseSize(): void {
    if (this.currentSize > this.minSize) {
      this.currentSize -= 2;
      this.saveAndApplySize();
    }
  }

  resetSize(): void {
    this.currentSize = 16;
    this.saveAndApplySize();
  }

  private saveAndApplySize(): void {
    localStorage.setItem('textSize', this.currentSize.toString());
    this.applyTextSize();
  }

  private applyTextSize(): void {
    // Aplicar la variable CSS global
    document.documentElement.style.setProperty('--base-font-size', `${this.currentSize}px`);
    
    // Forzar actualización inmediata del DOM
    setTimeout(() => {
      this.forceStyleUpdate();
    }, 100);
  }

  private forceStyleUpdate(): void {
    // Forzar recálculo de estilos en todos los elementos
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      if (htmlElement.style) {
        // Forzar recálculo
        htmlElement.style.fontSize = `var(--base-font-size, ${this.currentSize}px)`;
      }
    });
    
    // Disparar evento personalizado para notificar cambios
    window.dispatchEvent(new CustomEvent('textSizeChanged', { 
      detail: { size: this.currentSize } 
    }));
  }

  getMinSize(): number {
    return this.minSize;
  }

  getMaxSize(): number {
    return this.maxSize;
  }
}

@Component({
  selector: 'app-text-size',
  template: `
    <div class="text-size-controls">
      <h3 class="text-lg font-semibold mb-4">Tamaño del Texto</h3>
      <div class="flex items-center gap-4">
        <button 
          (click)="decreaseSize()" 
          [disabled]="textSizeService.getCurrentSize() <= textSizeService.getMinSize()"
          class="btn-size decrease"
          title="Disminuir tamaño">
          A-
        </button>
        
        <span class="text-size-display">
          {{textSizeService.getCurrentSize()}}px
        </span>
        
        <button 
          (click)="increaseSize()" 
          [disabled]="textSizeService.getCurrentSize() >= textSizeService.getMaxSize()"
          class="btn-size increase"
          title="Aumentar tamaño">
          A+
        </button>
        
        <button 
          (click)="resetSize()" 
          class="btn-reset"
          title="Restablecer tamaño">
          Reset
        </button>
      </div>
    </div>
  `,
  styles: [`
    .text-size-controls {
      padding: 1rem;
      border: 2px solid var(--border-color, #00ff00);
      border-radius: 8px;
      background: var(--bg-secondary, #0000aa);
      box-shadow: var(--card-shadow, 0 0 20px rgba(0, 255, 255, 0.3));
    }

    .btn-size, .btn-reset {
      padding: 0.5rem 1rem;
      border: 2px solid var(--border-color, #00ff00);
      border-radius: 4px;
      background: var(--bg-tertiary, #0033cc);
      color: var(--text-primary, #ffcc00);
      cursor: pointer;
      font-weight: 600;
      font-family: var(--pixel-font, 'Courier New', monospace);
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .btn-size:hover:not(:disabled), .btn-reset:hover {
      background: var(--accent-color, #ff00ff);
      color: var(--bg-primary, #000033);
      box-shadow: 0 0 15px var(--accent-color, #ff00ff);
      transform: translateY(-2px);
    }

    .btn-size:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--input-bg, #000055);
      color: var(--text-tertiary, #ff00ff);
    }

    .btn-size.decrease {
      color: var(--text-secondary, #00ffff);
      border-color: var(--text-secondary, #00ffff);
    }

    .btn-size.decrease:hover:not(:disabled) {
      background: var(--text-secondary, #00ffff);
      box-shadow: 0 0 15px var(--text-secondary, #00ffff);
    }

    .btn-size.increase {
      color: var(--text-primary, #ffcc00);
      border-color: var(--text-primary, #ffcc00);
    }

    .btn-size.increase:hover:not(:disabled) {
      background: var(--text-primary, #ffcc00);
      box-shadow: 0 0 15px var(--text-primary, #ffcc00);
    }

    .btn-reset {
      color: var(--text-tertiary, #ff00ff);
      border-color: var(--text-tertiary, #ff00ff);
      font-size: 0.875rem;
    }

    .btn-reset:hover {
      background: var(--text-tertiary, #ff00ff);
      box-shadow: 0 0 15px var(--text-tertiary, #ff00ff);
    }

    .text-size-display {
      min-width: 60px;
      text-align: center;
      font-weight: 700;
      color: var(--heading-color, #00ffff);
      font-family: var(--pixel-font, 'Courier New', monospace);
      font-size: 1.2rem;
      text-shadow: 0 0 10px var(--heading-color, #00ffff);
    }

    /* Efectos adicionales para el tema cyberpunk */
    .text-size-controls::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, var(--accent-color, #ff00ff), var(--text-secondary, #00ffff), var(--text-primary, #ffcc00));
      border-radius: 10px;
      z-index: -1;
      opacity: 0.3;
      filter: blur(5px);
    }

    .text-size-controls {
      position: relative;
    }

    /* Animación de pulso para los botones activos */
    .btn-size:not(:disabled):active {
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(0.95); }
      100% { transform: scale(1); }
    }
  `]
})
export class TextSizeComponent {
  constructor(public textSizeService: TextSizeService) {}

  increaseSize(): void {
    this.textSizeService.increaseSize();
  }

  decreaseSize(): void {
    this.textSizeService.decreaseSize();
  }

  resetSize(): void {
    this.textSizeService.resetSize();
  }
}
