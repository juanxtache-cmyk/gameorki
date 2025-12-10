import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterLink } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { CartService } from "../services/cart.service"
import type { Cart } from "../models/cart.model"
import { CheckoutReceiptComponent } from './checkout-receipt.component';
import { jsPDF } from 'jspdf';
import { AuthService } from '../services/auth.service';

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CheckoutReceiptComponent],
  template: `
    <div class="cart-container">
      <h1 class="cart-title">Carrito de Compras</h1>
      
      <div class="cart-empty" *ngIf="!cart || !cart.items || cart.items.length === 0">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
        </div>
        <h2>Tu carrito está vacío</h2>
        <p>Parece que aún no has agregado ningún juego a tu carrito.</p>
        <a routerLink="/games" class="btn-primary">Explorar Juegos</a>
      </div>
      
      <div class="cart-content" *ngIf="cart && cart.items && cart.items.length > 0">
        <div class="cart-items">
          <div class="cart-header">
            <div class="product-info">Producto</div>
            <div class="product-price">Precio</div>
            <div class="product-quantity">Cantidad</div>
            <div class="product-total">Total</div>
            <div class="product-remove"></div>
          </div>
          
          <div class="cart-item" *ngFor="let item of cart.items">
            <div class="product-info">
              <div class="product-image">
                <img [src]="item.game.imageUrl" [alt]="item.game.title">
              </div>
              <div class="product-details">
                <h3><a [routerLink]="['/games', item.game.id]">{{ item.game.title }}</a></h3>
                <p class="product-category">Ver detalles: {{ item.game.category }}</p>
              </div>
            </div>
            
            <div class="product-price">
              <div *ngIf="item.game.discount" class="price-discount">
                <span class="original-price">{{ item.game.price | currency:'USD' }}</span>
                <span class="discount-badge">-{{ (item.game.discount * 100) | number:'1.0-0' }}%</span>
              </div>
              <div class="current-price">{{ getCurrentPrice(item.game) | currency:'USD' }}</div>
            </div>
            
            <div class="product-quantity">
              <div class="quantity-control">
                <button 
                  class="quantity-btn" 
                  (click)="updateQuantity(item.game.id, item.quantity - 1)"
                  [disabled]="item.quantity <= 1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                  </svg>
                </button>
                <input 
                  type="number" 
                  min="1" 
                  [value]="item.quantity" 
                  (change)="onQuantityChange($event, item.game.id)"
                >
                <button 
                  class="quantity-btn" 
                  (click)="updateQuantity(item.game.id, item.quantity + 1)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="product-total">
              {{ (getCurrentPrice(item.game) * item.quantity) | currency:'USD' }}
            </div>
            
            <div class="product-remove">
              <button class="remove-btn" (click)="removeItem(item.game.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="cart-actions">
          <button class="btn-secondary" (click)="clearCart()">Vaciar Carrito</button>
          <a routerLink="/games" class="btn-outline">Continuar Comprando</a>
        </div>
        
        <div class="cart-summary">
          <h2>Resumen del Pedido</h2>
          
          <div class="summary-row">
            <span>Subtotal</span>
            <span>{{ (cart.totalPrice || 0) | currency:'USD' }}</span>
          </div>
          
          <div class="summary-row">
            <span>Impuestos (16%)</span>
            <span>{{ ((cart.totalPrice || 0) * 0.16) | currency:'USD' }}</span>
          </div>
          
          <div class="summary-row total">
            <span>Total</span>
            <span>{{ ((cart.totalPrice || 0) * 1.16) | currency:'USD' }}</span>
          </div>
          
          <div class="promo-code">
            <input type="text" placeholder="Código promocional">
            <button class="btn-apply">Aplicar</button>
          </div>
          
          <button class="btn-checkout" (click)="proceedToCheckout()">Proceder al Pago</button>
        </div>
        
        <app-checkout-receipt
          [cart]="cart"
          [isVisible]="showReceipt"
        ></app-checkout-receipt>
      </div>
    </div>
  `,
  styles: [
    `
    .cart-container {
      padding: 20px;
    }
    
    .cart-title {
      font-size: 2rem;
      color: var(--heading-color);
      margin-bottom: 20px;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      text-shadow: 3px 3px 0 rgba(0,0,0,0.5);
      border-bottom: 3px solid var(--border-color);
      padding-bottom: 10px;
    }
    
    .cart-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 50px 20px;
      background-color: var(--bg-secondary);
      border: 3px solid var(--border-color);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.3);
      text-align: center;
    }
    
    .empty-icon {
      color: var(--text-secondary);
      margin-bottom: 20px;
      font-size: 64px;
    }
    
    .cart-empty h2 {
      font-size: 1.5rem;
      color: var(--heading-color);
      margin-bottom: 10px;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
    }
    
    .cart-empty p {
      color: var(--text-secondary);
      margin-bottom: 20px;
      font-family: var(--retro-font);
      font-size: 1.2rem;
    }
    
    .btn-primary {
      background-color: var(--accent-color);
      color: white;
      padding: 10px 20px;
      border: 3px solid var(--border-color);
      border-radius: 0;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      font-size: 0.8rem;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
    }
    
    .btn-primary:hover {
      background-color: var(--accent-hover);
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
    }
    
    .cart-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .cart-items {
      background-color: var(--bg-secondary);
      border: 3px solid var(--border-color);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.3);
    }
    
    .cart-header {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr 1fr 0.5fr;
      padding: 15px;
      background-color: var(--bg-tertiary);
      border-bottom: 3px solid var(--border-color);
      font-family: var(--pixel-font);
      text-transform: uppercase;
      font-size: 0.8rem;
      color: var(--text-primary);
      text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
    }
    
    .cart-item {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr 1fr 0.5fr;
      padding: 15px;
      border-bottom: 2px solid var(--border-color);
      align-items: center;
    }
    
    .cart-item:last-child {
      border-bottom: none;
    }
    
    .product-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .product-image {
      width: 80px;
      height: 80px;
      border: 2px solid var(--border-color);
      overflow: hidden;
    }
    
    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      image-rendering: pixelated;
    }
    
    .product-details h3 {
      margin: 0 0 5px 0;
      font-size: 1rem;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      letter-spacing: -1px;
    }
    
    .product-details h3 a {
      color: var(--heading-color);
      text-decoration: none;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
    }
    
    .product-details h3 a:hover {
      color: var(--accent-color);
      text-shadow: 0 0 5px var(--accent-color);
    }
    
    .product-category {
      color: var(--text-secondary);
      font-size: 0.8rem;
      font-family: var(--retro-font);
    }
    
    .price-discount {
      display: flex;
      flex-direction: column;
    }
    
    .original-price {
      color: var(--text-tertiary);
      text-decoration: line-through;
      font-size: 0.8rem;
      font-family: var(--retro-font);
    }
    
    .discount-badge {
      background-color: var(--accent-color);
      color: white;
      padding: 2px 5px;
      border-radius: 0;
      font-size: 0.7rem;
      display: inline-block;
      margin-top: 2px;
      border: 1px solid var(--border-color);
      font-family: var(--pixel-font);
    }
    
    .current-price {
      color: var(--accent-color);
      font-weight: 700;
      font-size: 1rem;
      font-family: var(--pixel-font);
      text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
    }
    
    .quantity-control {
      display: flex;
      align-items: center;
      border: 2px solid var(--border-color);
      width: fit-content;
    }
    
    .quantity-btn {
      background-color: var(--bg-tertiary);
      border: none;
      color: var(--text-primary);
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: none;
    }
    
    .quantity-btn:hover {
      background-color: var(--accent-color);
      color: white;
    }
    
    .quantity-control input {
      width: 40px;
      height: 30px;
      text-align: center;
      border: none;
      border-left: 2px solid var(--border-color);
      border-right: 2px solid var(--border-color);
      background-color: var(--input-bg);
      color: var(--text-primary);
      font-family: var(--retro-font);
    }
    
    .product-total {
      color: var(--accent-color);
      font-weight: 700;
      font-size: 1rem;
      font-family: var(--pixel-font);
      text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
    }
    
    .remove-btn {
      background-color: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      box-shadow: none;
    }
    
    .remove-btn:hover {
      color: var(--accent-color);
    }
    
    .cart-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    
    .btn-secondary {
      background-color: var(--bg-tertiary);
      color: var(--text-primary);
      padding: 10px 20px;
      border: 3px solid var(--border-color);
      border-radius: 0;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      font-size: 0.8rem;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
    }
    
    .btn-secondary:hover {
      background-color: var(--bg-secondary);
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
    }
    
    .btn-outline {
      background-color: transparent;
      color: var(--accent-color);
      padding: 10px 20px;
      border: 3px solid var(--border-color);
      border-radius: 0;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      font-size: 0.8rem;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
    }
    
    .btn-outline:hover {
      background-color: var(--accent-color);
      color: white;
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
    }
    
    .cart-summary {
      background-color: var(--bg-tertiary);
      border: 3px solid var(--border-color);
      padding: 20px;
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.3);
    }
    
    .cart-summary h2 {
      font-size: 1.3rem;
      color: var(--heading-color);
      margin-bottom: 20px;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 10px;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      font-family: var(--retro-font);
      font-size: 1.1rem;
      color: var(--text-secondary);
    }
    
    .summary-row.total {
      border-top: 2px solid var(--border-color);
      padding-top: 15px;
      margin-top: 15px;
      font-weight: 700;
      font-family: var(--pixel-font);
      color: var(--text-primary);
      font-size: 1.2rem;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
    }
    
    .promo-code {
      display: flex;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    
    .promo-code input {
      flex: 1;
      padding: 10px 15px;
      border: 3px solid var(--border-color);
      border-right: none;
      background-color: var(--input-bg);
      color: var(--text-primary);
      font-family: var(--retro-font);
    }
    
    .btn-apply {
      background-color: var(--bg-secondary);
      color: var(--text-primary);
      padding: 10px 15px;
      border: 3px solid var(--border-color);
      cursor: pointer;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      font-size: 0.8rem;
    }
    
    .btn-apply:hover {
      background-color: var(--accent-color);
      color: white;
    }
    
    .btn-checkout {
      width: 100%;
      padding: 12px;
      background-color: var(--accent-color);
      color: white;
      border: 3px solid var(--border-color);
      border-radius: 0;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      font-size: 1rem;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
      margin-top: 20px;
    }
    
    .btn-checkout:hover {
      background-color: var(--accent-hover);
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
    }
  `,
  ],
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [], totalItems: 0, totalPrice: 0 };
  showReceipt = false;
  currentDate = new Date();
  orderNumber = Math.floor(Math.random() * 1000000);

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del carrito
    this.cartService.cart$.subscribe((cart) => {
      // Asegurar que siempre tengamos una estructura válida de carrito
      this.cart = cart || { items: [], totalItems: 0, totalPrice: 0 };
      console.log('🛒 Carrito actualizado:', this.cart.totalItems, 'items');
    });
  }

  getCurrentPrice(game: any): number {
    return game.discount ? game.price * (1 - game.discount) : game.price;
  }

  onQuantityChange(event: Event, gameId: number): void {
    const input = event.target as HTMLInputElement;
    const quantity = Number.parseInt(input.value, 10);
    this.updateQuantity(gameId, quantity);
  }

  updateQuantity(gameId: number, quantity: number): void {
    const parsedQuantity = Number.parseInt(quantity.toString(), 10);
    if (isNaN(parsedQuantity)) {
      return;
    }
    this.cartService.updateQuantity(gameId, Math.max(1, parsedQuantity));
  }

  removeItem(gameId: number): void {
    this.cartService.removeFromCart(gameId);
  }

  clearCart(): void {
    if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
      this.cartService.clearCart();
    }
  }

  proceedToCheckout(): void {
    // Verificar si el usuario está autenticado
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      alert('Debes iniciar sesión para proceder con la compra');
      this.router.navigate(['/login']);
      return;
    }

    // Verificar si el carrito no está vacío
    if (!this.cart.items || this.cart.items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    // Redirigir a la página de checkout
    this.router.navigate(['/checkout']);
  }

  downloadPDF(): void {
    const doc = new jsPDF();
    const padding = 20;
    let yPosition = padding;
    
    // Título y datos generales
    doc.setFontSize(20);
    doc.text('Recibo de Compra - GameStore', padding, yPosition);
    
    yPosition += 20;
    doc.setFontSize(12);
    doc.text(`Fecha: ${this.currentDate.toLocaleString()}`, padding, yPosition);
    
    yPosition += 10;
    doc.text(`No. de Orden: ${this.orderNumber}`, padding, yPosition);
    
    yPosition += 20;
    // Cabecera de items
    doc.setFontSize(14);
    doc.text('Producto', padding, yPosition);
    doc.text('Cantidad', 100, yPosition);
    doc.text('Precio', 140, yPosition);
    doc.text('Total', 180, yPosition);
    
    yPosition += 10;
    doc.line(padding, yPosition, 190, yPosition);
    
    yPosition += 10;
    // Items del carrito
    doc.setFontSize(12);
    this.cart.items.forEach(item => {
      // Verificar si necesitamos una nueva página
      if (yPosition > 250) {
        doc.addPage();
        yPosition = padding;
      }
      
      const price = this.getCurrentPrice(item.game);
      const total = price * item.quantity;
      
      doc.text(item.game.title.substring(0, 40), padding, yPosition);
      doc.text(item.quantity.toString(), 100, yPosition);
      doc.text(`$${price.toFixed(2)}`, 140, yPosition);
      doc.text(`$${total.toFixed(2)}`, 180, yPosition);
      
      yPosition += 10;
    });
    
    yPosition += 10;
    doc.line(padding, yPosition, 190, yPosition);
    
    yPosition += 15;
    // Totales
    doc.text(`Subtotal: $${this.cart.totalPrice.toFixed(2)}`, 130, yPosition);
    yPosition += 10;
    doc.text(`IVA (16%): $${(this.cart.totalPrice * 0.16).toFixed(2)}`, 130, yPosition);
    yPosition += 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: $${(this.cart.totalPrice * 1.16).toFixed(2)}`, 130, yPosition);
    
    // Guardar el PDF
    doc.save(`recibo-${this.orderNumber}.pdf`);
  }
}
