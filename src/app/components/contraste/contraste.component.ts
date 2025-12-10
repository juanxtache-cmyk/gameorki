import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contraste',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contraste.component.html',
  styleUrl: './contraste.component.css'
})
export class ContrasteComponent implements OnInit {
  contrasteActivo: boolean = false;

  ngOnInit() {
    // Cargar el estado guardado del contraste
    const contrasteGuardado = localStorage.getItem('contrasteActivo');
    if (contrasteGuardado === 'true') {
      this.contrasteActivo = true;
      this.aplicarContraste();
    }
  }

  toggleContraste() {
    this.contrasteActivo = !this.contrasteActivo;
    
    if (this.contrasteActivo) {
      this.aplicarContraste();
    } else {
      this.quitarContraste();
    }
    
    // Guardar el estado en localStorage
    localStorage.setItem('contrasteActivo', this.contrasteActivo.toString());
  }

  private aplicarContraste() {
    document.body.classList.add('high-contrast');
  }

  private quitarContraste() {
    document.body.classList.remove('high-contrast');
  }
}
