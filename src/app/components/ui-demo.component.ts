import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../shared/components/button.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, CardDescriptionComponent } from '../shared/components/card.component';
import { InputComponent } from '../shared/components/input.component';

@Component({
  selector: 'app-ui-demo',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonComponent, 
    CardComponent, 
    CardHeaderComponent, 
    CardTitleComponent, 
    CardDescriptionComponent,
    CardContentComponent,
    InputComponent
  ],
  template: `
    <div class="p-8 space-y-6">
      <h1 class="text-3xl font-bold text-center">Demo de Componentes UI Angular</h1>
      
      <!-- Card Demo -->
      <app-card className="max-w-md mx-auto">
        <app-card-header>
          <app-card-title>Componente Card</app-card-title>
          <app-card-description>
            Este es un ejemplo del componente Card migrado de React a Angular
          </app-card-description>
        </app-card-header>
        <app-card-content>
          <p class="text-sm text-muted-foreground">
            Contenido del card con estilos de Tailwind CSS
          </p>
        </app-card-content>
      </app-card>

      <!-- Buttons Demo -->
      <div class="flex flex-wrap gap-4 justify-center">
        <app-button variant="default">Botón Default</app-button>
        <app-button variant="secondary">Botón Secondary</app-button>
        <app-button variant="destructive">Botón Destructive</app-button>
        <app-button variant="outline">Botón Outline</app-button>
        <app-button variant="ghost">Botón Ghost</app-button>
        <app-button variant="link">Botón Link</app-button>
      </div>

      <!-- Input Demo -->
      <div class="max-w-md mx-auto space-y-4">
        <app-input 
          type="text" 
          placeholder="Ingresa tu nombre"
          className="w-full">
        </app-input>
        
        <app-input 
          type="email" 
          placeholder="tu@email.com"
          className="w-full">
        </app-input>
      </div>

      <div class="text-center text-sm text-muted-foreground">
        ✅ Migración de React a Angular completada exitosamente!
      </div>
    </div>
  `
})
export class UiDemoComponent {}