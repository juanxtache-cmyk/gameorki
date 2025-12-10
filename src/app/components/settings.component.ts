import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TextSizeComponent } from './text_size';
import { ContrasteComponent } from './contraste/contraste.component';



@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [TextSizeComponent, RouterModule, ContrasteComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  cursorSize: number = 16; // Tamaño inicial del cursor en píxeles

  changeCursorSize(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.cursorSize = value;
    document.documentElement.style.setProperty('--cursor-size', `${value}px`);
  }

  
  
  }
