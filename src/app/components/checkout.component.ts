import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { PurchaseService } from '../services/purchase.service';
import { AuthService } from '../services/auth.service';
import type { Cart } from '../models/cart.model';
import type { User } from '../models/user.model';
import { PurchaseOrder, PurchaseOrderItem, OrderSummary } from '../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  currentUser: User | null = null;
  selectedPaymentMethod: string = ''; // Agregar esta línea
  isProcessing: boolean = false;
  showSuccessModal: boolean = false;
  successOrderNumber: string = '';
  orderSummary: OrderSummary | null = null;

  constructor(
    private cartService: CartService,
    private purchaseService: PurchaseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.loadCurrentUser();
    this.selectedPaymentMethod = 'credit_card'; // Selecciona tarjeta por defecto
  }

  loadCart(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
      this.calculateOrderSummary();
    });
  }

  loadCurrentUser(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getTotalItems(): number {
    if (!this.cart || !this.cart.items) return 0;
    return this.cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    if (!this.cart || !this.cart.items) return 0;
    return this.cart.items.reduce((total, item) => total + (item.game.price * item.quantity), 0);
  }

  calculateOrderSummary(): void {
    if (!this.cart || !this.cart.items) {
      this.orderSummary = null;
      return;
    }

    const subtotal = this.getTotalPrice();
    const taxes = subtotal * 0.16; // 16% tax
    const total = subtotal + taxes;
    const itemCount = this.getTotalItems();

    this.orderSummary = {
      subtotal,
      taxes,
      total,
      itemCount
    };
  }

  getTotalKeyCount(): number {
    return this.getTotalItems();
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  async processPurchase(): Promise<void> {
    if (!this.cart || !this.currentUser || !this.selectedPaymentMethod) {
      return;
    }

    this.isProcessing = true;

    try {
      const result = await this.purchaseService.processPurchase(this.selectedPaymentMethod);
      
      if (result.success) {
        this.successOrderNumber = result.orderNumber || 'N/A';
        this.showSuccessModal = true;
        
        // El servicio ya limpia el carrito
        this.cart = null; // Actualizar local
      } else {
        alert(`Error en la compra: ${result.error || 'Error desconocido'}`);
      }
      
    } catch (error) {
      console.error('Error processing purchase:', error);
      alert('Error al procesar la compra. Por favor, inténtalo de nuevo.');
    } finally {
      this.isProcessing = false;
    }
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return 'GS-' + timestamp.slice(-6) + '-' + random;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/games']);
  }

  goToPurchaseHistory(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/purchase-history']);
  }

  goToStore(): void {
    this.router.navigate(['/games']);
  }

  viewOrderHistory(): void {
    this.router.navigate(['/purchase-history']);
  }

  // Agregar los métodos necesarios
  onPaymentMethodChange() {
    if (this.selectedPaymentMethod === 'paypal') {
      setTimeout(() => {
        this.initPayPalButtons();
      }, 500);
    }
  }

  initPayPalButtons() {
    if (!(window as any).paypal) {
      console.error('PayPal SDK no está cargado');
      return;
    }

    const paypal = (window as any).paypal;
    const container = document.getElementById('paypal-button-container');

    if (container) {
      container.innerHTML = '';
    }

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.orderSummary?.total?.toFixed(2) || '0.00'
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          this.handlePayPalSuccess(details);
        });
      },
      onError: (err: any) => {
        console.error('Error PayPal:', err);
        alert('Error en el pago con PayPal');
      }
    }).render('#paypal-button-container');
  }

  handlePayPalSuccess(details: any) {
    console.log('✅ Pago exitoso:', details);
    this.successOrderNumber = details.id;
    this.showSuccessModal = true;
  }
}
