import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartService } from './cart.service';
import { KeyGeneratorService, GameKey } from './key-generator.service';
import { EmailService } from './email.service';
import { AuthService } from './auth.service';
import { PurchaseOrder, PurchaseOrderItem, OrderSummary } from '../models/order.model';
import type { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private readonly ORDERS_STORAGE_KEY = 'purchase_orders';
  private ordersSubject = new BehaviorSubject<PurchaseOrder[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(
    private cartService: CartService,
    private keyGeneratorService: KeyGeneratorService,
    private emailService: EmailService,
    private authService: AuthService
  ) {
    this.loadOrders();
  }

  /**
   * Procesa una compra completa
   */
  async processPurchase(paymentMethod: string = 'credit_card'): Promise<{success: boolean, orderNumber?: string, error?: string}> {
    try {
      const currentUser = this.authService.currentUserValue;
      if (!currentUser) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      // Obtener carrito actual usando el observable
      let cart: Cart;
      this.cartService.cart$.subscribe(currentCart => {
        cart = currentCart;
      }).unsubscribe();

      if (!cart! || !cart!.items || cart!.items.length === 0) {
        return { success: false, error: 'El carrito está vacío' };
      }

      // 1. Generar número de orden único
      const orderNumber = this.generateOrderNumber();

      // 2. Crear items de la orden
      const orderItems: PurchaseOrderItem[] = cart!.items.map((item: any) => ({
        gameId: item.game.id,
        gameTitle: item.game.title,
        price: item.game.price,
        quantity: item.quantity
      }));

      // 3. Generar keys para cada juego
      const generatedKeys = this.keyGeneratorService.generateKeysForPurchase(
        orderItems.map(item => ({
          gameId: item.gameId,
          gameTitle: item.gameTitle,
          quantity: item.quantity
        })),
        currentUser.email
      );

      // 4. Crear la orden de compra
      const order: PurchaseOrder = {
        id: this.generateUniqueId(),
        orderNumber,
        userId: currentUser.email,
        userEmail: currentUser.email,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        items: orderItems,
        totalAmount: cart!.totalPrice,
        status: 'completed',
        paymentMethod,
        purchaseDate: new Date(),
        keys: generatedKeys.map(key => key.id)
      };

      // 5. Guardar la orden
      this.saveOrder(order);

      // 6. Enviar correo con las keys
      const emailSent = await this.emailService.sendPurchaseConfirmation(
        currentUser.email,
        order.userName,
        generatedKeys,
        orderNumber,
        orderItems,
        cart!.totalPrice
      );

      if (!emailSent) {
        console.warn('La compra se procesó pero hubo un problema enviando el correo');
      }

      // 7. Limpiar el carrito
      this.cartService.clearCart();

      // 8. Mostrar notificación de éxito
      this.showPurchaseNotification(orderNumber, generatedKeys.length);

      return { success: true, orderNumber };

    } catch (error) {
      console.error('Error procesando la compra:', error);
      return { success: false, error: 'Error procesando la compra' };
    }
  }

  /**
   * Genera un número de orden único
   */
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `GS-${timestamp.slice(-6)}-${random}`;
  }

  /**
   * Genera un ID único
   */
  private generateUniqueId(): string {
    return 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Guarda una orden en localStorage
   */
  private saveOrder(order: PurchaseOrder): void {
    const orders = this.getStoredOrders();
    orders.push(order);
    localStorage.setItem(this.ORDERS_STORAGE_KEY, JSON.stringify(orders));
    this.ordersSubject.next(orders);
  }

  /**
   * Carga las órdenes desde localStorage
   */
  private loadOrders(): void {
    const orders = this.getStoredOrders();
    this.ordersSubject.next(orders);
  }

  /**
   * Obtiene las órdenes almacenadas
   */
  private getStoredOrders(): PurchaseOrder[] {
    const stored = localStorage.getItem(this.ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Obtiene todas las órdenes del usuario actual
   */
  getUserOrders(): PurchaseOrder[] {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return [];

    return this.getStoredOrders().filter(order => order.userId === currentUser.email);
  }

  /**
   * Obtiene una orden específica por número
   */
  getOrderByNumber(orderNumber: string): PurchaseOrder | null {
    const orders = this.getStoredOrders();
    return orders.find(order => order.orderNumber === orderNumber) || null;
  }

  /**
   * Obtiene las keys de una orden específica
   */
  getOrderKeys(orderNumber: string): GameKey[] {
    const order = this.getOrderByNumber(orderNumber);
    if (!order) return [];

    const allKeys = this.keyGeneratorService.getAllKeys();
    return allKeys.filter(key => order.keys.includes(key.id));
  }

  /**
   * Calcula el resumen de una orden
   */
  calculateOrderSummary(cart: Cart): OrderSummary {
    const subtotal = cart.totalPrice;
    const taxes = subtotal * 0.16; // 16% IVA
    const total = subtotal + taxes;

    return {
      subtotal,
      taxes,
      total,
      itemCount: cart.totalItems
    };
  }

  /**
   * Muestra una notificación de compra exitosa
   */
  private showPurchaseNotification(orderNumber: string, keyCount: number): void {
    const message = `✅ ¡Compra exitosa!\nOrden: ${orderNumber}\n${keyCount} key(s) enviada(s) por correo`;
    
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 10001;
      font-family: Arial, sans-serif;
      max-width: 400px;
      font-size: 16px;
      line-height: 1.5;
    `;
    
    notification.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
      <h3 style="margin: 0 0 15px 0;">¡Compra Exitosa!</h3>
      <p style="margin: 0 0 10px 0;"><strong>Orden:</strong> ${orderNumber}</p>
      <p style="margin: 0 0 20px 0;">${keyCount} key(s) enviada(s) por correo</p>
      <div style="font-size: 12px; opacity: 0.8;">Esta ventana se cerrará automáticamente</div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  /**
   * Obtiene estadísticas de compras del usuario
   */
  getUserPurchaseStats(): {
    totalOrders: number;
    totalSpent: number;
    totalGames: number;
    recentOrders: PurchaseOrder[];
  } {
    const userOrders = this.getUserOrders();
    const totalSpent = userOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalGames = userOrders.reduce((sum, order) => 
      sum + order.items.reduce((gameSum, item) => gameSum + item.quantity, 0), 0
    );

    return {
      totalOrders: userOrders.length,
      totalSpent,
      totalGames,
      recentOrders: userOrders
        .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
        .slice(0, 5)
    };
  }

  /**
   * Reenvía las keys de una orden por correo
   */
  async resendOrderKeys(orderNumber: string): Promise<boolean> {
    const order = this.getOrderByNumber(orderNumber);
    if (!order) return false;

    const keys = this.getOrderKeys(orderNumber);
    if (keys.length === 0) return false;

    return await this.emailService.sendPurchaseConfirmation(
      order.userEmail,
      order.userName,
      keys,
      orderNumber,
      order.items,
      order.totalAmount
    );
  }
}