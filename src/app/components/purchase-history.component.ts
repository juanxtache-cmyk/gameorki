import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PurchaseService } from '../services/purchase.service';
import { KeyGeneratorService } from '../services/key-generator.service';
import { EmailService } from '../services/email.service';
import { AuthService } from '../services/auth.service';
import type { PurchaseOrder } from '../models/order.model';
import type { GameKey } from '../services/key-generator.service';

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css']
})
export class PurchaseHistoryComponent implements OnInit {
  orders: PurchaseOrder[] = [];
  userStats: any = {};
  isLoading = true;

  constructor(
    private purchaseService: PurchaseService,
    private keyGeneratorService: KeyGeneratorService,
    private emailService: EmailService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPurchaseHistory();
  }

  private loadPurchaseHistory() {
    // Verificar autenticación
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.isLoading = false;
      return;
    }

    // Cargar órdenes del usuario
    this.orders = this.purchaseService.getUserOrders();
    
    // Cargar estadísticas
    this.userStats = this.purchaseService.getUserPurchaseStats();
    
    this.isLoading = false;
  }

  getOrderKeys(orderNumber: string): GameKey[] {
    return this.purchaseService.getOrderKeys(orderNumber);
  }

  async resendKeys(orderNumber: string) {
    const success = await this.purchaseService.resendOrderKeys(orderNumber);
    if (success) {
      alert('¡Keys reenviadas exitosamente a tu correo electrónico!');
    } else {
      alert('Hubo un error al reenviar las keys. Inténtalo más tarde.');
    }
  }

  copyKeyToClipboard(key: string) {
    navigator.clipboard.writeText(key).then(() => {
      // Mostrar feedback visual
      const toast = document.createElement('div');
      toast.textContent = '¡Key copiada al portapapeles!';
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 10000;
        font-family: Arial, sans-serif;
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 2000);
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-pending';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackByOrderId(index: number, order: PurchaseOrder): string {
    return order.id;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  }

  // Métodos helper para manejar precios de forma segura
  getItemPrice(item: any): string {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    return price.toFixed(2);
  }

  getItemTotal(item: any): string {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    const quantity = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 0;
    return (price * quantity).toFixed(2);
  }

  getTotalSpent(): string {
    const totalSpent = typeof this.userStats.totalSpent === 'number' ? 
      this.userStats.totalSpent : parseFloat(this.userStats.totalSpent) || 0;
    return totalSpent.toFixed(2);
  }

  getOrderTotal(order: any): string {
    const totalAmount = typeof order.totalAmount === 'number' ? 
      order.totalAmount : parseFloat(order.totalAmount) || 0;
    return totalAmount.toFixed(2);
  }
}