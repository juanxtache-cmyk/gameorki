import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import type { Cart } from "../models/cart.model";

@Component({
  selector: "app-checkout-receipt",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="receipt-modal" *ngIf="isVisible">
      <div class="receipt-content">
        <div class="receipt-header">
          <h2>Recibo de Compra</h2>
          <button class="close-btn" (click)="close()">×</button>
        </div>
        
        <div class="receipt-body">
          <div class="receipt-info">
            <p>Fecha: {{ currentDate | date:'medium' }}</p>
            <p>No. de Orden: {{ orderNumber }}</p>
          </div>
          
          <div class="receipt-items">
            <div class="receipt-item" *ngFor="let item of cart.items">
              <span>{{ item.game.title }}</span>
              <span>{{ item.quantity }}x</span>
              <span>{{ getCurrentPrice(item.game) * item.quantity | currency:'USD' }}</span>
            </div>
          </div>
          
          <div class="receipt-summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>{{ cart.totalPrice | currency:'USD' }}</span>
            </div>
            <div class="summary-row">
              <span>IVA (16%):</span>
              <span>{{ cart.totalPrice * 0.16 | currency:'USD' }}</span>
            </div>
            <div class="summary-row total">
              <span>Total:</span>
              <span>{{ cart.totalPrice * 1.16 | currency:'USD' }}</span>
            </div>
          </div>
        </div>
        
        <div class="receipt-footer">
          <button class="btn-download" (click)="downloadPDF()">Descargar PDF</button>
          <button class="btn-close" (click)="close()">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .receipt-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .receipt-content {
      background-color: var(--bg-secondary);
      border: 3px solid var(--border-color);
      box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.3);
      width: 90%;
      max-width: 600px;
      padding: 20px;
    }

    .receipt-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 10px;
      margin-bottom: 20px;
    }

    .receipt-header h2 {
      font-family: var(--pixel-font);
      color: var(--heading-color);
      text-transform: uppercase;
      margin: 0;
      text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--text-primary);
    }

    .receipt-info {
      font-family: var(--retro-font);
      margin-bottom: 20px;
    }

    .receipt-items {
      margin-bottom: 20px;
    }

    .receipt-item {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color);
      font-family: var(--retro-font);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-family: var(--retro-font);
    }

    .summary-row.total {
      border-top: 2px solid var(--border-color);
      padding-top: 10px;
      margin-top: 10px;
      font-weight: bold;
      font-family: var(--pixel-font);
      color: var(--accent-color);
    }

    .receipt-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    .btn-download, .btn-close {
      padding: 8px 16px;
      border: 2px solid var(--border-color);
      font-family: var(--pixel-font);
      cursor: pointer;
      text-transform: uppercase;
      transition: all 0.3s;
      box-shadow: 3px 3px 0 rgba(0,0,0,0.3);
    }

    .btn-download {
      background-color: var(--accent-color);
      color: white;
    }

    .btn-close {
      background-color: var(--bg-tertiary);
      color: var(--text-primary);
    }

    .btn-download:hover, .btn-close:hover {
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 0 rgba(0,0,0,0.3);
    }
  `]
})
export class CheckoutReceiptComponent {
  @Input() cart!: Cart;
  @Input() isVisible: boolean = false;

  currentDate = new Date();
  orderNumber = Math.floor(Math.random() * 1000000);

  getCurrentPrice(game: any): number {
    return game.discount ? game.price * (1 - game.discount) : game.price;
  }

  close(): void {
    this.isVisible = false;
  }

  downloadPDF(): void {
    // Aquí implementaremos la lógica para descargar el PDF
    console.log('Descargando PDF...');
  }
}