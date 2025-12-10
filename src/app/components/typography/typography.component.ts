import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TypographyComponent {
  selectedFont: string = 'Arial';
  fontSize: number = 16;
  fontWeight: string = 'normal';

  constructor() {
    // Inicializar con los valores guardados
    const savedFont = localStorage.getItem('appFont');
    const savedSize = localStorage.getItem('appFontSize');
    const savedWeight = localStorage.getItem('appFontWeight');

    if (savedFont) {
      this.selectedFont = savedFont;
      this.applyFontFamily();
    }

    if (savedSize) {
      this.fontSize = parseInt(savedSize);
      this.applyFontSize();
    }

    if (savedWeight) {
      this.fontWeight = savedWeight;
      this.applyFontWeight();
    }
  }

  // Lista de fuentes disponibles
  availableFonts = [
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
    { value: '"Times New Roman", serif', label: 'Times New Roman' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: '"Trebuchet MS", sans-serif', label: 'Trebuchet MS' },
    { value: '"Segoe UI", system-ui, sans-serif', label: 'Segoe UI' },
    { value: 'Roboto, Arial, sans-serif', label: 'Roboto' }
  ];

  // Lista de pesos de fuente
  fontWeights = [
    { value: 'normal', label: 'Normal' },
    { value: 'bold', label: 'Negrita' },
    { value: '300', label: 'Ligera' },
    { value: '600', label: 'Semi Negrita' }
  ];

  private applyFontFamily() {
    // Aplicar directamente al body y todos sus descendientes
    document.body.style.setProperty('font-family', this.selectedFont + ', system-ui, sans-serif', 'important');
    
    // Aplicar a la variable CSS para elementos que la usen
    document.documentElement.style.setProperty('--font-family', this.selectedFont);

    // Aplicar a todos los elementos principales que podrían tener su propia fuente
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, input, select, textarea');
    elements.forEach(element => {
      (element as HTMLElement).style.setProperty('font-family', this.selectedFont + ', system-ui, sans-serif', 'important');
    });
  }

  private applyFontSize() {
    document.documentElement.style.setProperty('--base-font-size', `${this.fontSize}px`);
    document.body.style.fontSize = `${this.fontSize}px`;
  }

  private applyFontWeight() {
    document.documentElement.style.setProperty('--font-weight', this.fontWeight);
    document.body.style.fontWeight = this.fontWeight;
  }

  onFontChange() {
    this.applyFontFamily();
    localStorage.setItem('appFont', this.selectedFont);
  }

  onFontSizeChange() {
    this.applyFontSize();
    localStorage.setItem('appFontSize', this.fontSize.toString());
  }

  onFontWeightChange() {
    this.applyFontWeight();
    localStorage.setItem('appFontWeight', this.fontWeight);
  }

  ngOnInit() {
    // Recuperar configuraciones guardadas
    const savedFont = localStorage.getItem('appFont');
    const savedFontSize = localStorage.getItem('appFontSize');
    const savedFontWeight = localStorage.getItem('appFontWeight');

    if (savedFont) {
      this.selectedFont = savedFont;
      this.onFontChange();
    }

    if (savedFontSize) {
      this.fontSize = parseInt(savedFontSize);
      this.onFontSizeChange();
    }

    if (savedFontWeight) {
      this.fontWeight = savedFontWeight;
      this.onFontWeightChange();
    }
  }
}