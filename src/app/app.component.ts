import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: '../app/components/app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'game';

  ngOnInit(): void {
    // Crear el div del cursor personalizado en el body si no existe
    if (!document.getElementById('custom-cursor')) {
      const cursorDiv = document.createElement('div');
      cursorDiv.id = 'custom-cursor';
      cursorDiv.innerHTML = '<img id="custom-cursor-img" src="/assets/cursor.svg" alt="cursor" />';
      document.body.appendChild(cursorDiv);
    }

    // Escuchar movimiento del mouse de forma global
    document.body.addEventListener('mousemove', this.moveCustomCursor);

    // Ocultar/mostrar el cursor personalizado cuando el puntero sale o entra
    document.addEventListener('mouseleave', () => {
      const cursor = document.getElementById('custom-cursor');
      if (cursor) cursor.style.display = 'none';
    });

    document.addEventListener('mouseenter', () => {
      const cursor = document.getElementById('custom-cursor');
      if (cursor) cursor.style.display = 'block';
    });
  }

  ngOnDestroy(): void {
    // Limpiar eventos al destruir el componente raíz (por si la app se desmonta)
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
